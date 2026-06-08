
import * as React from 'react';
import { useRef, useEffect } from "react";
import Backdrop from '@mui/material/Backdrop';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


import * as api from "../../module/api";


export default function StickyHeadTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([])
    const [userid, setUserid] = React.useState("")


    const [columns, setColumns] = React.useState([
        { id: 'st_number', align: "center", label: '考生名稱', minWidth: 100 },
        { id: 'action', align: "center", label: 'Action', minWidth: 100 },
    ])
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [newname, setNewname] = React.useState("")
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };

    const [open2, setOpen2] = React.useState(false);
    const handleClose2 = () => {
        setOpen2(false);
    };

    const [feedback, setFeedback] = React.useState(false)
    const [feedbackmsg, setMsg] = React.useState("")
    const handleFeedback = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setFeedback(false);
    }
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const MyDia = (
        <Dialog open={open}>
            <DialogTitle>新增考生</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    請輸入欲新增之考生學號
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="考生學號"
                    fullWidth
                    variant="standard"
                    onChange={(e) => {
                        setNewname(e.target.value)
                        console.log(newname)
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button color="error" variant="contained" onClick={() => {
                    handleClose()
                    setNewname("")
                }}>取消</Button>
                <Button color="success" variant="contained" onClick={async () => {

                    if (newname != "") {
                        handleClose()
                        console.log(newname)
                        setLoading(true)
                        setNewname("")
                        await api.manager_add_examinee(newname).then((result) => {
                            console.log(result)
                            setMsg(result)
                            setLoading(false)
                            setFeedback(true)
                        })
                        api.manager_examinee_show().then((data) => {
                            setRows(data)
                        })

                    } else {
                        alert("名稱不得為空！！！")
                    }
                }}>送出</Button>
            </DialogActions>
        </Dialog>)

    const MyDia2 = (
        <Dialog open={open2}>
            <DialogTitle>更改考生學號</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    請輸入欲更動之學號
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="新考生學號"
                    fullWidth
                    variant="standard"
                    onChange={(e) => {
                        setNewname(e.target.value)
                        console.log(newname)
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button color="error" variant="contained" onClick={() => {
                    handleClose2()
                    setNewname("")
                }}>取消</Button>
                <Button color="success" variant="contained" onClick={async () => {
                    if (newname != "") {
                        handleClose2()
                        setLoading(true)
                        await api.manager_change_examinee(userid, newname).then((result) => {
                            console.log(result)
                            setMsg(result)
                            setLoading(false)
                            setFeedback(true)
                            setNewname("")
                            setUserid("")
                        })
                        api.manager_examinee_show().then((data) => {
                            setRows(data)
                        })

                    } else {
                        alert("名稱不得為空！！！")
                    }
                }}>送出</Button>
            </DialogActions>
        </Dialog>)




    useEffect(() => {
        api.manager_examinee_show().then((data) => {
            setRows(data)
        })
    }, [])



    return (
        <div>
            {MyDia}
            {MyDia2}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Button variant="contained"
                onClick={() => {
                    setOpen(true)
                    console.log("新增考生")
                }}
            >
                新增考生
            </Button>
            <br />
            <br />
            <Paper
                sx={{ width: '50vw', overflow: 'hidden' }}
            >
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableCell
                                        key={index}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, backgroundColor: "#B5DCE8", }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            {columns.map((column, index) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={index} align={column.align}>
                                                        {value == "edit" ? (
                                                            <div>
                                                                <IconButton
                                                                    onClick={async () => {
                                                                        setOpen2(true)
                                                                        setUserid(row["user_id"])
                                                                    }}
                                                                    color="primary"
                                                                    children={<BorderColorIcon />}
                                                                />
                                                            </div>
                                                        ) : (value)
                                                        }
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Snackbar open={feedback} autoHideDuration={2000} onClose={handleFeedback}>
                <Alert onClose={handleFeedback}
                    severity={
                        feedbackmsg == "處理完畢" ? "success" : "info"
                    }
                    sx={{ width: '100%' }}>
                    {feedbackmsg}
                </Alert>
            </Snackbar>
        </div>

    )
}