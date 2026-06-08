import * as React from 'react';
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Link, Routes, Outlet } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ListSubheader from '@mui/material/ListSubheader';
import ScreenShareRoundedIcon from '@mui/icons-material/ScreenShareRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
// import ManagerShow from "./components/manager/managershow.jsx"
// import ManagerExaminee from "./components/manager/examinee_table.jsx"
// import { useCookies, Cookies } from 'react-cookie';


import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
// import Detect from "./components/examinee/detect.jsx"
// import DetectShow from "./components/examinee/detectshow.jsx"
import Demo from "./components/examinee/demo.jsx"

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}
const drawerWidth = 240;
const FireNav = styled(List)({
    '& .MuiListItemButton-root': {
        paddingLeft: 24,
        paddingRight: 24,
    },
    '& .MuiListItemIcon-root': {
        minWidth: 0,
        marginRight: 16,
    },
    '& .MuiSvgIcon-root': {
        fontSize: 28,
    },
});

function ResponsiveDrawer(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [login, setLogin] = React.useState(true)
    const [title, setTitle] = React.useState({
        "main": "考生功能",
        "sub": "開始考試"
    });
    const [inlineDemo, setInlineDemo] = React.useState(false);



    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <FireNav component="nav" disablePadding>
                <ListItemButton component="a"
                    href="/"
                >
                    <ListItemIcon sx={{ fontSize: 20 }}>🔥</ListItemIcon>
                    <ListItemText
                        sx={{ my: 0 }}
                        primary={
                            getCookie("account") == "admin" ? "監考系統(管理)" : "監考系統(考生)"
                        }
                        primaryTypographyProps={{
                            fontSize: 20,
                            fontWeight: 'medium',
                            letterSpacing: 0,
                        }}
                    />
                </ListItemButton>
                <Divider />
                <List
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            考生功能
                        </ListSubheader>}
                // style={{ display: !document.cookie.account ? "none" : "" }}
                >
                    {/* {['開始考試', '考試紀錄'].map((text, index) => (
                        <Link to={"/detect"} key={text} style={{ textDecoration: 'none', color: 'block' }}>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => { setTitle({ "main": "考生功能", "sub": text }) }}>
                                    <ListItemIcon>
                                        {index != 0 ? <WorkHistoryIcon /> : <ScreenShareRoundedIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    ))} */}
                    {/* 只保留 Demo 連結，其它考生頁面已註解 */}
                    {/*
                    <Link to={"/examinee/show"} style={{ textDecoration: 'none', color: 'black' }}>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => { setTitle({ "main": "考生功能", "sub": "開始考試" }) }}>
                                <ListItemIcon>
                                    <ScreenShareRoundedIcon />
                                </ListItemIcon>
                                <ListItemText primary={"開始考試"} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    */}
                    <ListItem disablePadding>
                        <ListItemButton component="button" onClick={(e) => { e.preventDefault(); setTitle({ "main": "考生功能", "sub": "Demo" }); setInlineDemo(true); }}>
                            <ListItemIcon>
                                <ScreenShareRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Demo"} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />

                {/* 管理功能已註解（保留 Demo 為唯一頁面）
                <List
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            管理功能
                        </ListSubheader>
                    }
                    style={{ display: getCookie("account") != "admin" ? "none" : "" }}
                >
                    <Link to={"/manager/show"} style={{ textDecoration: 'none', color: 'black' }}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    setTitle({ "main": "管理功能", "sub": "考試管理" })
                                }}>
                                <ListItemIcon>
                                    <WorkHistoryIcon />
                                </ListItemIcon>
                                <ListItemText primary={"考試管理"} />
                            </ListItemButton>
                        </ListItem>
                    </Link>

                    <Link to={"/manager/examinee_edit"} style={{ textDecoration: 'none', color: 'black' }}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    setTitle({ "main": "管理功能", "sub": "考生管理" })
                                }}>
                                <ListItemIcon>
                                    <GroupIcon />
                                </ListItemIcon>
                                <ListItemText primary={"考生管理"} />
                            </ListItemButton>
                        </ListItem>
                    </Link>



                </List>
                */}
                <Divider />
                {/* <Link to={"/talk"} style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                setTitle({ "main": "系統說明", "sub": "~~~~" })
                            }}>
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary={"系統說明"} />
                        </ListItemButton>
                    </ListItem>
                </Link> */}
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            eraseCookie("account")
                            // window.location.assign("/")
                            location.reload()
                        }}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary={"登出"} />
                    </ListItemButton>
                </ListItem>

            </FireNav>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Router>


            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6" noWrap component="div">
                            {title["main"]}  👉 {title["sub"]}

                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >
                    <Toolbar />
                    {/* <div style={{ display: login ? '' : 'none' }}>
                        aaa
                    </div> */}
                    {inlineDemo ? (
                        <div>
                            <Demo />
                        </div>
                    ) : (
                        <Routes>
                            <Route path={"/"}
                                element={
                                    <div>
                                        <h1>請點選左側功能列</h1>
                                    </div>
                                }
                            >
                            </Route>
                        </Routes>
                    )}

                </Box>
            </Box>
            <Outlet />
        </Router>
    );
}

// ResponsiveDrawer.propTypes = {
//     /**
//      * Injected by the documentation to work in an iframe.
//      * You won't need it on your project.
//      */
//     window: PropTypes.func,
// };



const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<ResponsiveDrawer />);