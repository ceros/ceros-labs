import VueRouter from 'vue-router';

import App from './components/App.vue'
import JobBoard from './components/JobBoard.vue';
import Job from './components/Job.vue';
import NotFound from './components/NotFound.vue';

const routes = [
    {
        path: '/',
        component: App,

        children: [
            {
                name: 'job-board',
                path: '/',
                component: JobBoard
            },
            {
                name: 'job',
                path: '/job/:id',
                component: Job
            },
            {
                name: '404',
                path: '/ohps',
                component: NotFound
            }
        ]
    },

    {
        name: 'linkedin-bug',
        path: '/%2Fjob%2F:id',

        redirect:  incomingRoute => {

            const { hash, params, query } = incomingRoute

            let destinationRoute = {
                name: '404'
            }

            if (params.id) {
                destinationRoute.name = 'job'

                destinationRoute.params = {
                    id: params.id
                }
            }

            return destinationRoute
        }
    },

    {
        path: '/*',
        redirect:  {
            name: '404'
        }
    }
];

const scrollBehavior = () => {
    return {
        x: 0,
        y: 0
    };
};

export default new VueRouter({
    routes,
    scrollBehavior
});