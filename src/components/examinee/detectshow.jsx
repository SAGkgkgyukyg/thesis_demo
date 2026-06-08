import * as React from 'react';
import { useRef, useEffect } from "react";
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { withStyles } from '@mui/styles';
import { Button, IconButton } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Chip from '@mui/material/Chip';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
// import Stack from '@mui/material/Stack';
import * as api from "../../module/api";
import Detect from "./detect"


// const columns = [
//     { id: 'exam', align: "center", label: '考試場次', minWidth: 100 },
//     { id: 'status', align: "center", label: '考試狀態', minWidth: 100 },
//     { id: 'edit', align: "center", label: 'Action', minWidth: 100 },
// ];


const styles = (theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
    root: {
        width: "50vw",
    },
    container: {
        maxHeight: 440,
    },
    word: {
        "font-size": "large",
        "font-weight": "bold",
    },
});

// function createData(exam, status, edit) {
//     return { exam, status, edit };
// }

// const rows = [
//     createData('Test1', 0, "edit",),
//     createData('Test2', 1, "edit",),
// ];


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export default function StickyHeadTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([])
    const [loading, setLoading] = React.useState(true);
    const [columns, setColumns] = React.useState([
        { id: 'exam', align: "center", label: '考試場次', minWidth: 100 },
        { id: 'status', align: "center", label: '考試狀態', minWidth: 100 },
        { id: 'edit', align: "center", label: 'Action', minWidth: 100 },
    ])
    const [module, setModule] = React.useState("show")
    const [examid, setExamid] = React.useState("")
    const [examname, setExamname] = React.useState("")
    const [userid, setUserid] = React.useState(getCookie("st_id"))
    const [stnumber, setNumber] = React.useState(getCookie("account"))

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        api.examinee_show(userid).then((data) => {
            setRows(data)
            setLoading(!loading)
        })
    }, [])



    return (
        <div>

            <Button
                style={{ display: module != "detect" ? "none" : "" }}
                variant="contained"
                onClick={() => {
                    setModule("show")

                }}>
                返回列表</Button>
            <Toolbar />
            <Detect
                show={module == "detect" ? true : false}
                examid={examid}
                examname={examname}
                st_id={userid}
                st_number={stnumber}
            />
            <Paper
                sx={{ width: '50vw', overflow: 'hidden' }}
                style={{ display: module == "detect" ? "none" : "" }}
            >

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

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
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            {columns.map((column, index) => {
                                                const value = row[column.id];
                                                // console.log(rows)

                                                return (
                                                    <TableCell key={index} align={column.align}>

                                                        {value == "edit" ? (
                                                            <IconButton
                                                                disabled={
                                                                    row["status"] != 0 ? true : false
                                                                }
                                                                onClick={() => {
                                                                    // console.log(row["exam_id"])
                                                                    setModule("detect")
                                                                    setExamid(row["exam_id"])
                                                                    setExamname(row["exam"])
                                                                    // console.log("edit")
                                                                    // window.location.href = "/examinee/detect/";
                                                                    // setColumns([
                                                                    //     { id: 'name', align: "center", label: '考試場次', minWidth: 100 },
                                                                    //     { id: 'status', align: "center", label: '考試狀態', minWidth: 100 },
                                                                    //     { id: 'edit', align: "center", label: 'Action', minWidth: 100 },
                                                                    // ])
                                                                }}
                                                                color="primary"
                                                                children={<BorderColorIcon />}
                                                            />
                                                        ) :
                                                            column.id == "status" ? (
                                                                <Chip
                                                                    label={
                                                                        value == 0 ? "開放中" : "已結束"
                                                                    }
                                                                    color={
                                                                        value == 0 ? "success" : "warning"
                                                                    }
                                                                />
                                                            ) : (value)
                                                        }
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
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
        </div>

    );
}

// export default withStyles(styles)(StickyHeadTable);
