// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22}/>;

const navConfig = [
    {
        title: 'dashboard',
        path: '/dashboard/app',
        icon: getIcon('eva:pie-chart-2-fill'),
    },
    {
        title: 'Utilisateurs',
        path: '/dashboard/user',
        icon: getIcon('eva:people-fill'),
        admin: true,
        children: [
            {
                title: 'Liste',
                path: '/dashboard/user/list'
            },
            {
                title: 'Creer',
                path: '/dashboard/user/form'
            },

        ]
    },
    {
        title: 'comptes',
        path: '/dashboard/account',
        icon: getIcon('eva:settings-outline'),
    },
    {
        title: 'blog',
        path: '/dashboard/blog',
        icon: getIcon('eva:file-text-fill'),
    },
    {
        title: 'login',
        path: '/login',
        icon: getIcon('eva:lock-fill'),
    },
    {
        title: 'register',
        path: '/register',
        icon: getIcon('eva:person-add-fill'),
    },
    {
        title: 'Textures',
        path: '/dashboard/textures',
        icon: getIcon('icon-park:texture'),
        admin: true,
        children: [
            {
                title: 'Liste',
                path: '/dashboard/textures/list'
            },
            {
                title: 'Creer',
                path: '/dashboard/textures/form'
            },

        ]
    },
    {
        title: 'Equipements',
        path: '/dashboard/equipments',
        icon: getIcon('carbon:chemistry'),
        admin: true,
        children: [
            {
                title: 'Liste',
                path: '/dashboard/textures/list'
            },
            {
                title: 'Creer',
                path: '/dashboard/equipments/form'
            },

        ]
    },
    {
        title: 'Effets',
        path: '/dashboard/effects',
        icon: getIcon('icon-park-outline:application-effect'),
        admin: true,
        children: [
            {
                title: 'Liste',
                path: '/dashboard/Effets/list'
            },
            {
                title: 'Creer',
                path: '/dashboard/Effets/form'
            },

        ]
    },
];

export default navConfig;
