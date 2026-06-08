import * as React from 'react';
import { useRef, useEffect } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { withStyles } from '@mui/styles';
import { IconButton } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Stack from '@mui/material/Stack';
// import SendIcon from '@mui/icons-material/Send';
// import Toolbar from '@mui/material/Toolbar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import * as api from "../../module/api";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItemIcon from '@mui/material/ListItemIcon';
import Switch from '@mui/material/Switch';
import ImageIcon from '@mui/icons-material/Image';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// const columns = [
//     { id: 'exam', align: "center", label: '考試場次', minWidth: 100 },
//     { id: 'people', align: "center", label: '考試人數', minWidth: 100 },
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

// function createData(exam, people, status, edit) {
//     return { exam, people, status, edit };
// }

// const rows = [
//     createData('Test1', 20, 0, "edit",),
//     createData('Test2', 2, 1, "edit",),
// ];

export default function StickyHeadTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [columns, setColumns] = React.useState([
        { id: 'exam', align: "center", label: '考試場次', minWidth: 100 },
        { id: 'people', align: "center", label: '考試人數', minWidth: 100 },
        { id: 'status', align: "center", label: '考試狀態', minWidth: 100 },
        { id: 'edit', align: "center", label: 'Action', minWidth: 100 },
    ])
    const [module, setModule] = React.useState("show")
    const [rows, setRows] = React.useState([])
    const [loading, setLoading] = React.useState(true);
    const [examid, setExamid] = React.useState("")
    const [examname, setExamname] = React.useState("載入中")
    const [examinee, setExaminee] = React.useState([])
    const [newname, setNewname] = React.useState("")
    const [userid, setUserid] = React.useState("")
    const [stnumber, setStnumber] = React.useState("")
    const [allexaminee, setAllexaminee] = React.useState([])
    const [imgs, setImgs] = React.useState([])
    const [img, setImg] = React.useState("")
    const [ocr, setOcr] = React.useState([])
    const [filter, setFilter] = React.useState("")
    const [feedback, setFeedback] = React.useState(false)
    const [feedbackmsg, setMsg] = React.useState("")

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleFeedback = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setFeedback(false);
    }


    // const handleexamClose = () => {
    //     set(false);
    // };



    const [checked, setChecked] = React.useState(true);

    const handleChange = async (event) => {
        setLoading(!loading)
        setChecked(event.target.checked);
        await api.manager_update_exam(examid, checked ? 1 : 0)
        await api.manager_show().then((data) => {
            setRows(data)
            console.log(data)
        })
        setLoading(false)
    };
    const MyDia = (
        <Dialog open={open}>
            <DialogTitle>新增考試</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    請輸入欲新增之考試場次名稱
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="考試場次名稱"
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
                    console.log(newname)
                    setNewname("")
                }}>取消</Button>
                <Button color="success" variant="contained" onClick={async () => {

                    if (newname != "") {
                        handleClose()
                        console.log(newname)
                        setLoading(true)
                        await api.manager_add_exam(newname)
                        setNewname("")
                        await api.manager_show().then((data) => {
                            setRows(data)
                            setLoading(false)
                        })
                    } else {
                        alert("名稱不得為空！！！")
                    }

                }}>送出</Button>
            </DialogActions>
        </Dialog>)


    const [examineechecked, setExamineechecked] = React.useState([]);

    const handleToggle = (value) => () => {
        const currentIndex = examineechecked.indexOf(value);
        const newChecked = [...examineechecked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setExamineechecked(newChecked);
        console.log(newChecked)

    };

    const [examineeopen, setExamineeopen] = React.useState(false);
    const Myexamdia = (
        <Dialog open={examineeopen}>
            <DialogTitle>新增考生</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    請勾選欲新增之考生
                </DialogContentText>
                {
                    allexaminee.map((value, index) => {
                        return (
                            <ListItem
                                key={index}
                                disablePadding
                            >
                                <ListItemButton
                                    onClick={handleToggle(value["user_id"])}
                                    dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={examineechecked.indexOf(value["user_id"]) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={value["st_number"]} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })

                }
            </DialogContent>
            <DialogActions>
                <Button color="error" variant="contained" onClick={() => {
                    // handleexamClose()
                    setExamineeopen(false)
                    // console.log(newname)
                    // setNewname("")
                }}>取消</Button>
                <Button color="success" variant="contained" onClick={async () => {
                    setExamineeopen(false)
                    setLoading(true)
                    console.log(examineechecked)
                    await api.manager_add_exam_student(examid, examineechecked)
                    await api.manager_get_examinee(examid).then((data) => {
                        setExaminee(data)
                    })
                    setExamineechecked([])
                    setLoading(false)
                }}>送出</Button>
            </DialogActions>
        </Dialog>)








    useEffect(() => {
        api.manager_show().then((data) => {
            setRows(data)
            setLoading(!loading)
        })
        api.manager_get_all_examinee().then((data) => {
            setAllexaminee(data)
        })
    }, [])

    // useEffect(() => {
    //     api.manager_show().then((data) => {
    //         setRows(data)
    //         setLoading(!loading)
    //     })
    // }, [examid])

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });


    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {MyDia}
            {Myexamdia}
            <Stack direction="row" spacing={2}>

                <Button variant="contained"
                    style={{ display: module != "show" ? "none" : "" }}
                    onClick={() => {
                        setOpen(true)

                    }}
                >
                    新增考試
                </Button>

                <Button variant="contained"
                    color='secondary'
                    style={{ display: module == "show" ? "none" : "" }}
                    onClick={async () => {
                        setModule("show")
                        setExaminee([])
                        setImgs([])
                        setOcr([])
                        setImg("")
                        setExamname("載入中")
                    }}
                >
                    返回列表
                </Button>
                {/* <Button variant="contained"
                    color='success'
                    onClick={async () => {
                        console.log("test")
                    }}
                >
                    測試按鈕
                </Button> */}
                <Button variant="contained"
                    style={{ display: module == "show" ? "none" : "" }}
                    onClick={async () => {
                        await api.manager_start_ocr(examid).then((result) => {
                            console.log(result)
                            // console.log(type(result))
                            setMsg(result)
                        })
                        setFeedback(true)
                    }}
                >
                    開始 OCR
                </Button>

            </Stack>
            <br />




            <Grid container spacing={2} style={{ display: module == "show" ? "none" : "" }}>
                <Grid item xs={3}>
                    <Box
                        style={{ display: module == "show" ? "none" : "", width: "300px" }}
                        sx={{ flexGrow: 1, }}>


                        <FormControlLabel
                            control={
                                <Switch
                                    checked={checked}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            }
                            label="考試狀態"
                        />
                        <br />
                        <Box sx={{ color: 'text.secondary', fontSize: 30 }}>
                            {examname} 考生名單
                        </Box>
                        <Button variant="contained"
                            color='success'
                            onClick={async () => {
                                // console.log(allexaminee)
                                // console.log(examid)
                                setExamineeopen(true)
                                // setExamineechecked(examinee.map((element) => element.user_id))
                                // console.log(examineechecked)
                            }}
                        >
                            新增考生
                        </Button>

                        <br />
                        <br />
                        <List dense={false}
                            sx={{ overflow: "auto", width: '100%', height: '30vh', borderRadius: 2, borderColor: "black", border: 2 }}
                        >
                            {examinee.map((value, index) => {
                                return (
                                    <ListItem
                                        style={{
                                            background:
                                                value["user_id"] == userid
                                                    ? "lightsteelblue"
                                                    : "none",
                                        }}
                                        key={index}
                                        secondaryAction={
                                            <IconButton edge="end"
                                                onClick={async () => {
                                                    console.log(value["user_id"])

                                                    setUserid(value["user_id"])
                                                    setStnumber(value["st_number"])
                                                    setLoading(true)
                                                    let ans = await api.manager_get_examinee_all_imgs(examid, value["user_id"])
                                                    console.log(ans)
                                                    setImgs(ans)
                                                    setLoading(false)
                                                }}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                <PersonIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={value["st_number"] + "(" + value["image_count"] + ")"}
                                            style={{ overflow: "hidden" }}
                                        />
                                    </ListItem>
                                )
                            })
                            }

                        </List>
                        <Box sx={{ color: 'text.secondary', fontSize: 30 }}>
                            {stnumber}截圖清單
                        </Box>
                        <TextField id="filled-basic" label="篩選文字" variant="filled"
                            // value={filter}
                            onChange={(e) => { setFilter(e.target.value) }}
                        />

                        <Button variant="contained"
                            color='success'
                            onClick={async () => {
                                // console.log(ocr)
                                function countAInOcrResult(ocr_result) {
                                    let count = 0;
                                    ocr_result.forEach(str => {
                                        count += (str.match(new RegExp(filter, "g")) || []).length;
                                    });
                                    return count;
                                }

                                const sortedInfo = await imgs.sort((a, b) => {
                                    const aCount = countAInOcrResult(a.ocr_result);
                                    const bCount = countAInOcrResult(b.ocr_result);
                                    return bCount - aCount;
                                });

                                setImgs(sortedInfo)
                                console.log(sortedInfo);
                                // console.log(imgs)

                            }}
                        >
                            篩選OCR結果
                        </Button>
                        <br />
                        <br />
                        <List dense={false}
                            sx={{ overflow: "auto", width: '100%', height: '30vh', borderRadius: 2, borderColor: "black", border: 2 }}
                        >


                            {imgs.map((value, index) => {
                                return (
                                    <ListItem
                                        style={{
                                            background:
                                                value["img_path"] == img
                                                    ? "lightsteelblue"
                                                    : "none",
                                        }}
                                        key={index}
                                        secondaryAction={
                                            <IconButton edge="end"
                                                onClick={() => {
                                                    setImg(value["img_path"])
                                                    setOcr(value["ocr_result"])
                                                    // console.log(ocr)
                                                }}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                <ImageIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={value["img_path"]}
                                            style={{ overflow: "hidden" }}
                                        />
                                    </ListItem>
                                )
                            })
                            }

                        </List>
                    </Box>
                </Grid>

                <Grid item xs={9} >
                    <Box
                    // sx={{ flexGrow: 1, maxWidth: "70vw" }}

                    // sx={{
                    //     bgcolor: 'background.paper',
                    //     borderRadius: 2,
                    //     border: 2,
                    //     p: 2,
                    //     displayPrint: ocr != [] ? "" : "none"
                    // }}
                    // style={{ display: ocr != [] ? "" : "none" }}
                    >
                        <img src={"https://uclleea397.blob.core.windows.net/screen-db-2/" + img} alt=""
                            style={{ width: "-webkit-fill-available", height: "auto" }}
                        />
                        {/* <img src="" alt="" width="" height="720" srcset="" /> */}
                    </Box>
                    <br />
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            // border: 2,
                            p: 2,
                            displayPrint: ocr != [] ? "" : 'none'
                        }}
                    >
                        <Stack spacing={{ xs: 1, sm: 1 }} direction="row" useFlexGap flexWrap="wrap">
                            {
                                ocr.map((value, index) => {
                                    return (
                                        <Chip label={value} key={index} />
                                    )
                                })

                            }
                            {/* <Chip label="Chip Filled" />
                            <Chip label="Chip Outlined" variant="outlined" /> */}
                        </Stack>
                    </Box>
                </Grid>

            </Grid>


            <Paper
                sx={{ width: '50vw', overflow: 'hidden' }}
                style={{ display: module != "show" ? "none" : "" }}
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
                            {
                                // module == "show" ?
                                rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                                                        // disabled={row["status"] != 0 ? true : false}
                                                                        onClick={async () => {
                                                                            if (module == "show") {
                                                                                setLoading(!loading)
                                                                                setModule("exam")

                                                                                setChecked(row["status"] == 0 ? true : false)
                                                                                // console.log("hi")
                                                                                let result = await api.manager_get_examinee(row["exam_id"])
                                                                                setExamid(row["exam_id"])
                                                                                setExamname(row["exam"])
                                                                                setExaminee(result)
                                                                                console.log(result)
                                                                                setLoading(false)
                                                                            }
                                                                        }}
                                                                        color="primary"
                                                                        children={<BorderColorIcon />
                                                                        }
                                                                    />
                                                                </div>

                                                            ) :
                                                                column.id == "status" ? (
                                                                    <Chip
                                                                        label={value == 0 ? "開放中" : "已結束"}
                                                                        color={value == 0 ? "success" : "warning"}
                                                                    />
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
        </div >

    );
}

// export default withStyles(styles)(StickyHeadTable);
