<template>
    <div>
        <cards v-for="card in cards" :key="card.id" :card="card" v-on:card_deleted="open_snackbar"></cards>
        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
        >
            {{ text }}

            <template v-slot:action="{ attrs }">
                <v-btn
					color="white"
					text
					v-bind="attrs"
					@click="snackbar = false"
                >
                	Zamknij
                </v-btn>
            </template>
        </v-snackbar>
    </div>
    
</template>

<script>
	import Cards from '@/components/Cards.vue';

	export default {
		data: () => ({ 
			cards: null,
			snackbar: false,
			text: 'Karta została usunięta pomyślnie',
			timeout: 2000,
		}),


		components: {
			Cards
		},


		beforeMount() {
			this.get_cards();
		},


		methods: {
			async get_cards() {
				let rs = await this.$axios.get('read.php');
				if(rs.data.body) {
					this.cards = rs.data.body;
				}
			},


			open_snackbar() {
				this.snackbar = true;
				setTimeout(() => {
					window.location.href = '/'
				}, 2000);
			}
		}
	}
</script>