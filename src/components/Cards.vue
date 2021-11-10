<template>
    
    <v-card
        outlined
        elevation="11"
        class="mt-5 ml-5 mr-5"
    >
        <v-list-item three-line>
            <v-list-item-content>
                <div class="text-overline mb-4">
                    {{ card.nr }}
                </div>
                <v-list-item-title class="text-h5 mb-4">
                    Saldo {{ card.balance }} {{ currency }}
                </v-list-item-title>
                <v-list-item-subtitle>Data aktywacji: {{ formatted_activation_date }}</v-list-item-subtitle>
                <v-list-item-subtitle>Data ważności: {{ formatted_expiration_date }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar
                tile
                size="80"
                color="grey"
                class="pin" @click="toggle_pin"
            >
                <div>
                    <span>{{ pin }}</span>
                </div>
            </v-list-item-avatar>
        </v-list-item>

        <v-card-actions class="justify-end">
            <router-link :to="`/edit/${card.id}`">
                <v-btn
                    depressed
                    color="primary"
                    class="mr-2"
                >
                
                    Edytuj
                </v-btn>
            </router-link>
            <v-btn
                depressed
                color="error"
                @click="delete_card(card.id)"
            >
                Usuń
            </v-btn>
        </v-card-actions>
    </v-card>
    
</template>

<script>
export default {
    props: ['card'],


    data: () => ({
        currency: 'zł',
        pin: 'PIN'
    }),

    computed: {
        formatted_activation_date() {
            let splitted_date = this.card.activation_date.split(' ')[0].split('-');
            return `${splitted_date[2]}.${splitted_date[1]}.${splitted_date[0]}`;
        },

        formatted_expiration_date() {
            let splitted_date = this.card.validto_date.split(' ')[0].split('-');
            return `${splitted_date[2]}.${splitted_date[1]}.${splitted_date[0]}`;
        }
    },


    methods: {
        toggle_pin() {
            this.pin =  this.pin === 'PIN' ? this.card.pin : 'PIN'; 
        },


        async delete_card(card_id) {

            let data = {
                "id": card_id
            }

            let rs = await this.$axios.delete('delete.php', { data: data });

            if(rs.status == 200) {
                this.$emit('card_deleted')
                console.log('teraz');
            }
			
        }
    }
}
</script>
<style scoped>
    .pin {
        cursor: pointer;
        -moz-user-select: none;
        -webkit-user-select: none;
    }
</style>