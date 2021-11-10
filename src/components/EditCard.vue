<template>
    
    <v-card
        outlined
        elevation="11"
        class="mt-5 ml-5 mr-5"
        v-if="card"
    >
        <h1 class="pl-3 pt-3">Edycja karty</h1>
        <form class="mt-5 ml-5 mr-5 mb-5">
            <v-text-field
                v-model="nr"
                :error-messages="nrErrors"
                :counter="20"
                label="Numer karty"
                required
                @input="$v.nr.$touch()"
                @blur="$v.nr.$touch()"
                class="mb-1"
            ></v-text-field>

            <v-text-field
                v-model="pin"
                :error-messages="pinErrors"
                :counter="4"
                label="PIN"
                required
                @input="$v.pin.$touch()"
                @blur="$v.pin.$touch()"
                class="mb-1"
            ></v-text-field>

            <v-text-field
                v-model="balance"
                :error-messages="balanceErrors"
                label="Kwota"
                required
                @input="$v.balance.$touch()"
                @blur="$v.balance.$touch()"
                class="mb-1"
            ></v-text-field>
            
            <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="computedDateFormatted"
                        label="Data aktywacji karty"
                        hint="DD/MM/YYYY"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        class="mb-5"
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="date"
                    no-title
                    @input="menu2 = false"
                ></v-date-picker>
            </v-menu>
            <v-menu
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="computedDateValidationFormatted"
                        label="Data ważności karty"
                        hint="DD/MM/YYYY"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        class="mb-5"
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="date_validation"
                    no-title
                    @input="menu = false"
                ></v-date-picker>
            </v-menu>
            <v-btn
                class="d-block ml-auto"
                color="primary"
                @click="submit"
            >
            Zapisz
            </v-btn>
        </form>
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
    </v-card>
    
</template>

<script>
    import { validationMixin } from 'vuelidate'
    import { required, maxLength, minLength } from 'vuelidate/lib/validators'

export default {
    mixins: [validationMixin],

    validations: {
      nr: { required, maxLength: maxLength(20), minLength: minLength(20) },
	  pin: { required, maxLength: maxLength(4), minLength: minLength(4) },
	  balance: { required }
    },

    data: vm => ({
        currency: 'zł',
        pin: 'PIN',
        card: null,
        nr: '',
        pin: '',
        balance: '',
		date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
		dateFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
		date_validation: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
		dateFormattedValidation: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
		menu: false,
		menu2: false,
		datetime: null,
		snackbar: false,
		text: 'Karta została zaktualizowana',
		timeout: 2000,
    }),

    computed: {
        formatted_activation_date() {
            let splitted_date = this.card.activation_date.split(' ')[0].split('-');
            let splitted_hour = this.card.activation_date.split(' ')[1];
            return `${splitted_date[2]}.${splitted_date[1]}.${splitted_date[0]} ${splitted_hour}`;
        },


        formatted_expiration_date() {
            let splitted_date = this.card.validto_date.split(' ')[0].split('-');
            return `${splitted_date[2]}.${splitted_date[1]}.${splitted_date[0]}`;
        },


        nrErrors () {
            const errors = []
            if (!this.$v.nr.$dirty) return errors
            !this.$v.nr.maxLength && errors.push('Numer karty musi składać się z 20 cyfr')
            !this.$v.nr.minLength && errors.push('Numer karty musi składać się z 20 cyfr')
            !this.$v.nr.required && errors.push('Numer karty jest wymagany.')
            return errors
        },


        pinErrors () {
            const errors = []
            if (!this.$v.pin.$dirty) return errors
            !this.$v.pin.maxLength && errors.push('PIN musi składać się z 4 cyfr')
            !this.$v.pin.minLength && errors.push('PIN musi składać się z 4 cyfr')
            !this.$v.pin.required && errors.push('PIN jest wymagany.')
            return errors
        },


        balanceErrors () {
            const errors = []
            if (!this.$v.balance.$dirty) return errors
            !this.$v.balance.required && errors.push('Kwota jest wymagana.')
            return errors
        },


        computedDateFormatted () {
            return this.formatDate(this.date)
        },


        computedDateValidationFormatted () {
            return this.formatDate(this.date_validation)
        }
    },


    watch: {
		date (val) {
			this.dateFormatted = this.formatDate(this.date)
		},
		
		date_validation (val) {
			this.dateFormattedValidation = this.formatDate(this.date_validation)
		}
    },


    beforeMount() {
        this.read_card(this.$route.params.id);
    },


    methods: {
        toggle_pin() {
            this.pin =  this.pin === 'PIN' ? this.card.pin : 'PIN'; 
        },


        async read_card(id) {
            let rs = await this.$axios.get(`single_read.php/?id=${id}`);

            if(rs.data) {
                this.card = rs.data;
                this.nr = this.card.nr;
                this.balance = this.card.balance;
                this.pin = this.card.pin;
                this.date = this.card.activation_date.split(' ')[0];
                this.date_validation = this.card.validto_date.split(' ')[0];
            }
        },


        async submit () {
			this.$v.$touch()
			if(!this.$v.$error) {
				let data = {
                    "id": this.$route.params.id,
					"nr": this.nr,
					"pin": this.pin,
					"activation_date": this.date,
					"validto_date": this.date_validation,
					"balance": this.balance
				}

				let rs = await this.$axios.post('update.php', data);

				if(rs.status === 200) {
					this.snackbar = true;
					setTimeout(() => {
						this.$router.push('/');
					}, 2000);
				}
			}
        },
        

		formatDate (date) {
			if (!date) return null

			const [year, month, day] = date.split('-')
			return `${day}/${month}/${year}`
        },
        

		parseDate (date) {
			if (!date) return null

			const [month, day, year] = date.split('/')
			return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
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