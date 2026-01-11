import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, ShoppingBag, Info, Phone } from '@mui/icons-material';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveTab = () => {
        const path = location.pathname;
        if (path === '/') return 0;
        if (path === '/shop') return 1;
        if (path === '/about') return 2;
        return 0;
    };

    const [value, setValue] = React.useState(getActiveTab());

    React.useEffect(() => {
        setValue(getActiveTab());
    }, [location.pathname]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        const routes = ['/', '/shop', '/about'];
        if (newValue < 3) {
            navigate(routes[newValue]);
        }
    };

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                display: { xs: 'block', md: 'none' },
                zIndex: 1000,
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            }}
            elevation={3}
        >
            <BottomNavigation
                value={value}
                onChange={handleChange}
                showLabels
                sx={{
                    height: '60px',
                    '& .MuiBottomNavigationAction-root': {
                        minWidth: 'auto',
                        padding: '6px 0',
                    },
                    '& .Mui-selected': {
                        color: '#e91e63',
                    },
                }}
            >
                <BottomNavigationAction
                    label="Home"
                    icon={<Home />}
                />
                <BottomNavigationAction
                    label="Shop"
                    icon={<ShoppingBag />}
                />
                <BottomNavigationAction
                    label="About"
                    icon={<Info />}
                />

            </BottomNavigation>
        </Paper>
    );
};

export default BottomNav;
