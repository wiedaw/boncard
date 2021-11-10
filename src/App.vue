<template>
	<v-app id="inspire">
		<v-navigation-drawer v-model="drawer" app>
		<v-list-item>
			<v-list-item-content>
				<v-list-item-title class="text-h6">
					Menu
				</v-list-item-title>
			</v-list-item-content>
		</v-list-item>

		<v-divider></v-divider>

		<v-list
			dense
			nav
		>
			<v-list-item
				v-for="item in items"
				:key="item.title"
				link
			>
				<router-link :to="item.link">
					<v-list-item-icon>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
					</v-list-item-content>
				</router-link>
			</v-list-item>
		</v-list>
		</v-navigation-drawer>

		<v-app-bar app>
			<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

			<v-toolbar-title>
				Boncard
			</v-toolbar-title>
		</v-app-bar>

		<v-main d-flex>
			<router-view></router-view>
		</v-main>
		
	</v-app>
</template>

<script>

	export default {
		data: () => ({ 
			drawer: null,
			items: [
				{ title: 'Pulpit', icon: 'mdi-view-dashboard', link: '/' },
				{ title: 'Dodaj kartę', icon: 'mdi-card-bulleted', link: '/card' }
			]
		}),

	}
</script>
<style scoped>
	a, a:hover {
		display: flex;
		color: rgba(0, 0, 0, 0.87) !important;
		text-decoration: none !important;
		width: 100%;
	}
</style>