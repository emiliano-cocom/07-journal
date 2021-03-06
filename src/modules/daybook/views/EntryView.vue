import { defineAsyncComponent } from 'vue';
<template>
    <template v-if="entry">
        <div class="entry-title d-flex justify-content-between p-2">
            <div>
                <span class="text-success fs-3 fw-bold">{{ day }}</span>
                <span class="mx-1 fs-3">{{ month }}</span>
                <span class="mx-2 fs-4 fw-light">{{ yearDay }}</span>
            </div>

            <div>
                <button v-if="entry.id" @click="onDeleteEntry" class="btn btn-danger mx-2">
                    Borrar
                    <i class="fa fa-trash-alt"></i>
                </button>

                <button class="btn btn-primary">
                    Subir foto
                    <i class="fa fa-upload"></i>
                </button>
            </div>
        </div>

        <hr>
        <div class="d-flex flex-column px-3 h-75">
            <textarea v-model="entry.text" placeholder="¿Qué sucedió hoy?"></textarea>
        </div>

        <img src="https://www.construyehogar.com/wp-content/uploads/2017/11/Dise%C3%B1o-fachada-casa-moderna.jpg" 
        alt="entry-picture"
        class="img-thumbnail"
        >
    </template>

    <Fab icon="fa-save" @on:click="saveEntry"/>

</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex'; // computed!!!
import getDayMonthYear from '@/modules/daybook/helpers/getDayMonthYear'
import Swal from 'sweetalert2'

export default {
    props: {
        id: {
            type: String,
            required: true,
        }
    },
    components: {
        Fab: defineAsyncComponent(() => import(/* webpackChunkName: "Fab" */ '@/modules/daybook/components/Fab')),
    },
    data() {
        return {
            entry: null,
        }
    },
    computed: {
        ...mapGetters( 'journal', ['getEntryById'] ),

        day() {
            const { day } = getDayMonthYear( this.entry.date )
            return day
        },
        month() {
            const { month } = getDayMonthYear( this.entry.date )
            return month
        },
        yearDay() {
            const { yearDay } = getDayMonthYear( this.entry.date )
            return yearDay
        }
    },
    methods: {
        ...mapActions( 'journal', ['updateEntries', 'createEntry', 'deleteEntry']),
        
        loadEntry() {
            let entry

            if( this.id === 'new' ) {
                entry = {
                    text: '',
                    date: new Date().getTime(),
                }

            }else {
                entry = this.getEntryById( this.id )
                if( !entry ) return this.$router.push({ name: 'no-entry' })
            }
            
            this.entry = entry
        },
        async saveEntry() {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()

            if( this.entry.id ) {
                // update entry
                await this.updateEntries( this.entry )
            }else {
                // create new entry
                const id = await this.createEntry( this.entry )
                this.$router.push({ name: 'entry', params: { id }})
            }

            Swal.fire( 'Guardado', 'Entrada registrada con éxito', 'success' )
        },
        async onDeleteEntry() {

            const { isConfirmed } = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Una vez borrado, no se puede recuperar',
                showDenyButton: true,
                confirmButtonText: 'Sí, estoy seguro'
            })

            if( isConfirmed === true ) {
                new Swal({
                    title: 'Espere por favor',
                    allowOutsideClick: false,
                })
                Swal.showLoading()
                await this.deleteEntry( this.entry.id )
                // redirect user
                this.$router.push({ name: 'no-entry' })
                Swal.fire( 'Eliminado', '', 'success' )
            }            
        }
    },
    created() {
        // console.log( this.$route.params.id )
        this.loadEntry()
    },
    watch: {
        id() {
            this.loadEntry()
        }
    }
}
</script>

<style lang="scss" scoped>

textarea {
    font-size: 20px;
    border: none;
    height: 100%;

    &:focus {
        outline: none;
    }
}

img {
    width: 200px;
    position: fixed;
    bottom: 150px;
    right: 20px;
    box-shadow: 0px 5px 10px rgba($color: #000000, $alpha: 0.2)
}

</style>