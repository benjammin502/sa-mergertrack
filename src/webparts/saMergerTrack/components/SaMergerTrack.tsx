import { MenuItem } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { SPFI } from '@pnp/sp';
import "@pnp/sp/attachments";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import '@pnp/sp/items';
import { IItemAddResult } from '@pnp/sp/items';
import { IItem } from "@pnp/sp/items/types";
import '@pnp/sp/lists';
import '@pnp/sp/site-users/web';
import '@pnp/sp/sites';
import '@pnp/sp/webs';
import { PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import * as React from 'react';
import { Controller, useForm } from "react-hook-form";
import ControlledDateInput from './controlledInputs/ControlledDateInput';
import ControlledPeoplePicker from './controlledInputs/ControlledPeoplePicker';
import ControlledSelect from './controlledInputs/ControlledSelect';
import ControlledTextField from './controlledInputs/ControlledTextField';
import { ISaMergerTrackProps } from './ISaMergerTrackProps';
import { getSP } from './pnpjsConfig';

// TODO: Implement EDIT LINK logic in Flow to users can access saved/pre-existing items from the list

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    outerContainer: {
      height: '100vh',
      backgroundColor: '#f2f6f9',
      width: '100%',
      paddingTop: '30px',
    },
    formControl: {
      width: '100%',
    },
    gridRow: {
      margin: theme.spacing(1),
    },
    paper: {
      padding: '0 25px',
    },
    title: {
      margin: '25px 0'
    },
    fileUploadInput: {
      display: 'none'
    },
    listItemIcon: {
      '&:hover': {
        color: '#cc0033',
        cursor: 'pointer'
      }
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paperModal: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #27323a',
      boxShadow: theme.shadows[1],
      padding: theme.spacing(2, 4, 3),
      borderRadius: '4px',
    },
    paperModalSubmit: {
      width: '15%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #27323a',
      boxShadow: theme.shadows[1],
      padding: theme.spacing(2, 4, 3),
      borderRadius: '4px',
    },
    successIcon: {
      fontSize: '5em',
      color: 'green',
      margin: '20px 0'
    },
    failureIcon: {
      fontSize: '5em',
      color: '#cc0033',
      margin: '20px 0'
    }
    // selectEmpty: {
    //   marginTop: theme.spacing(2),
    // },
  }),
);

// type FormInputs = {
//   notificationType: string;
// }


const SaMergerTrack: React.FC<ISaMergerTrackProps> = (props) => {
  const [analystEmail, setAnalystEmail] = React.useState('');
  const [savpAemail, setSavpAemail] = React.useState('');
  const [savpBemail, setSavpBemail] = React.useState('');
  const [itemId, setItemId] = React.useState(null);
  const [itemState, setItemState] = React.useState('');
  const [fileToUpload, setFileToUpload] = React.useState([]);
  const [saBpData, setSaBpData] = React.useState([]);
  const [autocompleteData, setAutocompleteData] = React.useState({
    at: "",
    atSPS: "",
    contractExpires: "",
    contractName: "",
    country: "",
    id: "",
    ot: "",
    rhfa: "",
    rhl: "",
    rhmr: "",
    rhmrSPS: "",
    rht: "",
    rhtSPS: "",
    scope: "",
    serviceType: "",
    tcg: "",
    vmsASP: ""
  });
  const [currentAttachments, setCurrentAttachments] = React.useState([]);
  const [fileNameToDelete, setFileNameToDelete] = React.useState('');
  const [saveOrSubmit, setSaveOrSubmit] = React.useState(null);
  const [submissionSuccess, setSubmissionSuccess] = React.useState(null);
  const [openSubmissionModal, setOpenSubmissionModal] = React.useState(false);
  const [openDeletedAttachmentModal, setOpenDeletedAttachmentModal] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const [autocompleteValue, setAutocompleteValue] = React.useState<string | null>(null);
  const [autocompleteInputValue, setAutocompleteInputValue] = React.useState('');

  const file = React.createRef<any>();
  const { control, handleSubmit, getValues, setValue, reset, register, formState: { errors, isValid, isSubmitting, isSubmitted } } = useForm({
    mode: 'onBlur',
  });

  let sp: SPFI;
  sp = getSP();

  // define css classes that need updates to what Material UI already provides
  const classes = useStyles();


  // Define columns to select from list
  const selectListColumns: string = `
  'AnalystId',
  'Analyst_x0020_Notes_x0020__x0028',
  'Client_x0020_Type_x0020__x0028_a',
  'Client_x0020_Type_x0020__x0028_b',
  'CoRec_x0020_Impact',
  'Id',
  'JoRec_x0020_Impact',
  'M_x0026_A_x0020_Type',
  'Merger_x0020_Status',
  'Notification_x0020_Date',
  'Notification_x0020_Type',
  'Notify',
  'Participating_x0020_Co_x002e_',
  'RH_x0020_Client_x0020_Action',
  'SAVP_x0020__x0028_A_x0029_Id',
  'SAVP_x0020__x0028_b_x0029_Id',
  'SA_x0020_Client_x0020__x0028_a_x',
  'SA_x0020_Client_x0020__x0028_b_x',
  'Scope_x0020_Exceptions',
  'Scope_x0020__x002d__x0020_Client',
  'Scope_x0020__x002d__x0020_Client0',
  'Scrub_x0020_Date',
  'Task_x0020_Status',
  'Title'
`;

  // set peoplepicker values on Get
  const setPeoplePickerUsers = async (dataFromGet) => {
    const { AnalystId, SAVP_x0020__x0028_A_x0029_Id, SAVP_x0020__x0028_b_x0029_Id } = dataFromGet;
    const analystUser = await sp.web.getUserById(AnalystId)();
    const savpAuser = await sp.web.getUserById(SAVP_x0020__x0028_A_x0029_Id)();
    const savpBuser = await sp.web.getUserById(SAVP_x0020__x0028_b_x0029_Id)();
    setAnalystEmail(analystUser.Email);
    setSavpAemail(savpAuser.Email);
    setSavpBemail(savpBuser.Email);

  };

  // fetch billing profiles JSON data
  const getSaBpData = async () => {
    // TODO: for go-live need to update the relative url to production
    const jsonData: any = await sp.web.getFileByServerRelativePath('/sites/Sandbox/bens-garage/sa/SA Billing Profiles Raw Data/saBP.json').getJSON();
    // console.log(jsonData.data);
    setSaBpData(jsonData.data);
  };

  const setDataValsFromAutocomplete = (selectedData) => {
    if (selectedData) {
      console.log(selectedData);
      // dynamically set sa/ra client a value
      setValue(
        'SA_x0020_Client_x0020__x0028_a_x',
        selectedData.contractName
        );
        // dynamically set sa/ra client b value
        setValue(
          'SA_x0020_Client_x0020__x0028_b_x',
          selectedData.contractName
          );
        // Dynamically set Scope - Client A value
        setValue(
          'Scope_x0020__x002d__x0020_Client',
          selectedData.scope,
          { shouldValidate: true }
        );
      setAutocompleteData(selectedData);
      setSnackbarOpen(true);
    }
  };

  // function to open Modal window for deleting an attachment
  const handleModalOpen = (attachmentName) => {
    setFileNameToDelete(attachmentName);
    setOpenDeletedAttachmentModal(true);
  };

  // function to close Modal window for deleting an attachment
  const handleModalClose = () => {
    setFileNameToDelete('');
    setOpenDeletedAttachmentModal(false);
  };

  // onChange event handler for file upload input
  const onSelectFile = (e) => {
    const files = file.current.files;
    setFileToUpload(files);
  };

  // function to upload new item attachment, called on submit if fileToUpload is not an empty array
  const uploadAttachments = (listItemId: number) => {
    let attachSuccess = false;
    const item: IItem = sp.web.lists.getByTitle("MergerTrack Dashboard").items.getById(listItemId);
    item.attachmentFiles.add(fileToUpload[0].name, fileToUpload[0]).then(() => {
      console.log('File Uploaded Successfully');
      attachSuccess = true;
    }).catch((err) => {
      console.log('Error Uploading Attachment: ', err);
      attachSuccess = false;
    });
    return attachSuccess;
  };

  // delete current Item attachment from list item when user clicks corresponding trashcan/delete icon
  const deleteItemAttachment = async () => {
    console.log(fileNameToDelete);
    console.log(currentAttachments);

    const newCurrentAttachmentsArray = currentAttachments;

    const item: IItem = sp.web.lists.getByTitle("MergerTrack Dashboard").items.getById(itemId);
    item.attachmentFiles.getByName(fileNameToDelete).recycle().then((data) => {
      console.log(data);
      setOpenDeletedAttachmentModal(true);

      let updatedAttachments = newCurrentAttachmentsArray.filter((item) => item.FileName !== fileNameToDelete);
      console.log(updatedAttachments);
      setCurrentAttachments(updatedAttachments);
      handleModalClose();
    }).catch((err) => {
      console.log('Error Deleting Attachment: ', err);
    });


  };

  // logic to recdirect user to the MergerTrack List after form submission
  const redirectUser = () => {
    location.href = 'https://roberthalf.sharepoint.com/sites/teams/sa/sa-setup/Lists/Merger%20%20Acquisition%20Activity%20Dashboard/AllItems.aspx';
  };

  // function called when user clicks on "SUBMIT TO VP" or "Save"
  const submitForm = async (notifyVal) => {
    setValue(
      'Notify',
      notifyVal
    );

    notifyVal === 'Yes' ? setSaveOrSubmit(true) : setSaveOrSubmit(false);

    handleSubmit(onSubmit)();
  };

  // onSubmit event handler
  const onSubmit = async (data) => {
    let attachmentSuccess = false;

    const rhfData = getValues();
    const dataToSubmit = {
      AnalystId: rhfData.AnalystId,
      Analyst_x0020_Notes_x0020__x0028: rhfData.Analyst_x0020_Notes_x0020__x0028,
      Client_x0020_Type_x0020__x0028_a: rhfData.Client_x0020_Type_x0020__x0028_a,
      Client_x0020_Type_x0020__x0028_b: rhfData.Client_x0020_Type_x0020__x0028_b,
      CoRec_x0020_Impact: rhfData.CoRec_x0020_Impact,
      JoRec_x0020_Impact: rhfData.JoRec_x0020_Impact,
      M_x0026_A_x0020_Type: rhfData.M_x0026_A_x0020_Type,
      Merger_x0020_Status: rhfData.Merger_x0020_Status,
      Notification_x0020_Type: rhfData.Notification_x0020_Type,
      Notify: rhfData.Notify,
      Participating_x0020_Co_x002e_: rhfData.Participating_x0020_Co_x002e_,
      RH_x0020_Client_x0020_Action: rhfData.RH_x0020_Client_x0020_Action,
      // Rev_x002e__x0020_Exclusion_x0020: rhfData.Rev_x002e__x0020_Exclusion_x0020,
      // Rev_x002e__x0020_Inclusion_x0020: rhfData.Rev_x002e__x0020_Inclusion_x0020,
      SAVP_x0020__x0028_A_x0029_Id: rhfData.SAVP_x0020__x0028_A_x0029_Id,
      SAVP_x0020__x0028_b_x0029_Id: rhfData.SAVP_x0020__x0028_b_x0029_Id,
      SA_x0020_Client_x0020__x0028_a_x: rhfData.SA_x0020_Client_x0020__x0028_a_x,
      SA_x0020_Client_x0020__x0028_b_x: rhfData.SA_x0020_Client_x0020__x0028_b_x,
      Scope_x0020_Exceptions: rhfData.Scope_x0020_Exceptions,
      Scope_x0020__x002d__x0020_Client: rhfData.Scope_x0020__x002d__x0020_Client,
      Scope_x0020__x002d__x0020_Client0: rhfData.Scope_x0020__x002d__x0020_Client0,
      Notification_x0020_Date: rhfData.Notification_x0020_Date,
      Scrub_x0020_Date: rhfData.Scrub_x0020_Date,
      Task_x0020_Status: rhfData.Task_x0020_Status,
      Title: rhfData.Title,
    };

    console.log(dataToSubmit);
    console.log(itemId);
    console.log(isValid);

    if (isValid) {
      // check itemId. This determines whether to add a new item or update an existing one
      if (itemId === 'new') {
        try {
          const addListItem: IItemAddResult = await sp
            .web
            .lists
            .getByTitle('MergerTrack Dashboard')
            .items
            .add(dataToSubmit);
          console.log(addListItem);

          if (fileToUpload.length > 0) {
            attachmentSuccess = uploadAttachments(addListItem.data.Id);
            attachmentSuccess === true ? setSubmissionSuccess(true) : setSubmissionSuccess(false);
          }

          setSubmissionSuccess(true);
          setOpenSubmissionModal(true);

        } catch (err) {

          setSubmissionSuccess(false);
          setOpenSubmissionModal(true);
          console.log(err);
        }

      } else {

        try {
          const updateListItem = await sp
            .web
            .lists
            .getByTitle('MergerTrack Dashboard')
            .items
            .getById(parseInt(itemId))
            .update(dataToSubmit);
          console.log(updateListItem);

          if (fileToUpload.length > 0) {
            attachmentSuccess = uploadAttachments(itemId);
            attachmentSuccess === true ? setSubmissionSuccess(true) : setSubmissionSuccess(false);
          }

          setSubmissionSuccess(true);
          setOpenSubmissionModal(true);

        } catch (err) {
          setSubmissionSuccess(false);
          setOpenSubmissionModal(true);
          console.log(err);
        }

      }
    }


  };


  React.useEffect(() => {
    console.log(fileToUpload);
  }, [fileToUpload]);

  React.useEffect(() => {
    
    setValue('JoRec_x0020_Impact', 0);
    setValue('CoRec_x0020_Impact', 0);
    register('Notify');

    if (location.search) {
      const queryString = location.search;
      const currentItemId = queryString.split('=')[1].split('&')[0];
      const currentItemState = queryString.split('=')[2];
      setItemId(currentItemId);
      setItemState(currentItemState);
    }

    // get call to retrieve current list item info based on url info
    if (itemId !== 'new') {

      (async () => {
        // get list item data
        const itemData = await sp
          .web
          .lists
          .getByTitle('MergerTrack Dashboard')
          .items
          .select(selectListColumns)
          .getById(itemId)();
        console.log(itemData);

        reset(itemData);
        setPeoplePickerUsers(itemData);
        setAutocompleteInputValue(itemData?.SA_x0020_Client_x0020__x0028_a_x);
        setValue(
          'Notify',
          'No'
        );
        
      })().catch(console.log);


      // Partial Attachment implementation on get existing item
      (async () => {
        // get list item by id
        const item: IItem = sp.web.lists.getByTitle("MergerTrack Dashboard").items.getById(itemId);
        // add an attachment
        const attachments = await item.attachmentFiles();
        console.log(attachments);

        setCurrentAttachments(attachments);
      })().catch(console.log)
    } else if (itemId === 'new') {

      setValue(
        'Notify',
        'No'
      );
    }
    getSaBpData();
  }, [itemId]);


  return (
    // outer most container for form (sub grid containers within)
    <Container maxWidth={false} className={classes.outerContainer}>
      <Container maxWidth="md">
        <Paper className={classes.paper}>

          <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>

            <Typography variant="h5" component="h1" gutterBottom align="left" className={classes.title}>
              {props.description}
            </Typography>

          </Grid>


          {/* top row form input grid item */}
          <Grid container direction="row" justifyContent="space-around" alignItems="flex-start" spacing={2}>

            <Grid item xs={12} md={4}>

              {/* Notification Type */}
              <ControlledSelect
                control={control}
                name="Notification_x0020_Type"
                required
                rules={{ required: true }}
                label="Notification Type"
                className={classes.formControl}
              // helperText="Required"
              >
                <MenuItem value="Addition">Addition</MenuItem>
                <MenuItem value="Reversal">Reversal</MenuItem>
                <MenuItem value="Prospect">Prospect</MenuItem>
                <MenuItem value="Overlap">Overlap</MenuItem>
              </ControlledSelect>

            </Grid>

            <Grid item xs={12} md={4}>
              {/* Notification Date */}
              <ControlledDateInput
                control={control}
                name="Notification_x0020_Date"
                className={classes.formControl}
                label="Notification Date"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              {/* Notification Date */}
              <ControlledDateInput
                control={control}
                name="Scrub_x0020_Date"
                className={classes.formControl}
                label="Scrub Date"
              />
            </Grid>

          </Grid>
          {/* end top row inputs start of second row inputs */}
          {/* start second row inputs */}
          <Grid container direction="row" justifyContent="space-around" alignItems="flex-start" spacing={2}>

            <Grid container item xs={12} md={6}>

              <Grid item xs={12}>
                <ControlledSelect
                  control={control}
                  name="Task_x0020_Status"
                  required
                  rules={{ required: true }}
                  label="Task Status"
                  className={classes.formControl}
                // helperText="Required"
                >
                  <MenuItem value="Assigned">Assigned</MenuItem>
                  <MenuItem value="Scrub Pending">Scrub Pending</MenuItem>
                  <MenuItem value="Scrubbed">Scrubbed</MenuItem>
                  <MenuItem value="Notified - Prospect">Notified - Prospect</MenuItem>
                  <MenuItem value="Notified - Overlap">Notified - Overlap</MenuItem>
                </ControlledSelect>
              </Grid>

              <Grid item xs={12}>
                <ControlledSelect
                  control={control}
                  name="M_x0026_A_x0020_Type"
                  required
                  rules={{ required: true }}
                  label="M&A Type"
                  className={classes.formControl}
                // helperText="Required"
                >
                  <MenuItem value="Acquisition">Acquisition</MenuItem>
                  <MenuItem value="Divestiture">Divestiture</MenuItem>
                  <MenuItem value="Merger">Merger</MenuItem>
                </ControlledSelect>
              </Grid>

              <Grid item xs={12}>


                <ControlledSelect
                  control={control}
                  name="Merger_x0020_Status"
                  required
                  rules={{ required: true }}
                  label="Merger Status"
                  className={classes.formControl}
                // helperText="Required"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </ControlledSelect>
              </Grid>
            </Grid>


            <Grid container item xs={12} md={6}>
              <Paper style={{ width: '100%', padding: '15px' }}>

                <Grid item xs={12}>
                  <ControlledPeoplePicker
                    context={props.context}
                    control={control}
                    titleText="Analyst"
                    name="AnalystId"
                    required={false}
                    principalTypes={[PrincipalType.User]}
                    defaultSelectedUsers={[analystEmail]}
                  />

                </Grid>

                <Grid item xs={12}>
                  <ControlledPeoplePicker
                    control={control}
                    titleText="SAVP (A)"
                    name="SAVP_x0020__x0028_A_x0029_Id"
                    required={false}
                    context={props.context}
                    principalTypes={[PrincipalType.User]}
                    defaultSelectedUsers={[savpAemail]}
                  />
                </Grid>

                <Grid item xs={12}>
                  <ControlledPeoplePicker
                    control={control}
                    titleText="SAVP (B)"
                    name="SAVP_x0020__x0028_b_x0029_Id"
                    required={false}
                    context={props.context}
                    principalTypes={[PrincipalType.User]}
                    defaultSelectedUsers={[savpBemail]}
                  />
                </Grid>

              </Paper>
            </Grid>


          </Grid>



          {/* fifth row inputs */}
          <Grid container direction="row" justifyContent="space-around" alignItems="flex-start" spacing={2}>

            <Grid item xs={12} md={6}>
              {/* revamp component to accurately display data from list item on GET */}
              <Controller
                name="SA_x0020_Client_x0020__x0028_a_x"
                control={control}
                defaultValue={null}
                rules={{ required: true }}
                render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => (
                  <Autocomplete
                    value={autocompleteValue}
                    onChange={
                      (e, data) => {
                        console.log(data);
                        onChange(data);
                        setAutocompleteValue(data);
                        setValue(
                          'SA_x0020_Client_x0020__x0028_a_x',
                          autocompleteValue,
                        );
                        setDataValsFromAutocomplete(data);
                      }
                    }
                    onBlur={onBlur}
                    clearOnBlur={false}
                    disableClearable={true}
                    className={classes.formControl}
                    id="saRaClientA"
                    autoHighlight={true}
                    inputValue={autocompleteInputValue}
                    onInputChange={
                      (e, newInputValue) => {
                        setValue(
                          'SA_x0020_Client_x0020__x0028_a_x',
                          newInputValue,
                        );
                        setAutocompleteInputValue(newInputValue);
                      }
                    }
                    options={saBpData}
                    defaultValue={null}
                    getOptionLabel={(option) => option.contractName}
                    // style={style}
                    renderInput={(params) => <TextField {...params} label="SA / RA Client (A)" variant="outlined" margin="dense" required error={!!error} helperText={error ? error?.message : null} />}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ControlledTextField
                control={control}
                name="SA_x0020_Client_x0020__x0028_b_x"
                required
                rules={{ required: true }}
                label="SA / RA Client (B)"
                className={classes.formControl}
              />
            </Grid>

          </Grid>

          {/* 6th row inputs */}
          <Grid container direction="row" justifyContent="space-around" alignItems="flex-start" spacing={2}>

            <Grid item xs={12} md={6}>
              <ControlledSelect
                control={control}
                name="Scope_x0020__x002d__x0020_Client"
                required
                rules={{ required: true }}
                label="Scope - Client A"
                className={classes.formControl}
              >
                <MenuItem value="Affiliates">Affiliates</MenuItem>
                <MenuItem value="Definitive List">Definitive List</MenuItem>
                <MenuItem value="Parent Only">Parent Only</MenuItem>
                <MenuItem value="Subsidiaries">Subsidiaries</MenuItem>
              </ControlledSelect>
            </Grid>

            <Grid item xs={12} md={6}>
              <ControlledSelect
                control={control}
                name="Scope_x0020__x002d__x0020_Client0"
                required
                rules={{ required: true }}
                label="Scope - Client B"
                className={classes.formControl}
              >
                <MenuItem value="Affiliates">Affiliates</MenuItem>
                <MenuItem value="Definitive List">Definitive List</MenuItem>
                <MenuItem value="Parent Only">Parent Only</MenuItem>
                <MenuItem value="Subsidiaries">Subsidiaries</MenuItem>
              </ControlledSelect>
            </Grid>


          </Grid>

          {/* 7th row inputs */}
          <Grid container direction="row" justifyContent="space-around" alignItems="flex-start" spacing={2}>

            <Grid item xs={12} md={6}>
              <ControlledSelect
                control={control}
                name="Client_x0020_Type_x0020__x0028_a"
                required
                rules={{ required: true }}
                label="Client Type (A)"
                className={classes.formControl}
              >
                <MenuItem value="Strategic Account">Strategic Account</MenuItem>
                <MenuItem value="Regional Account">Regional Account</MenuItem>
              </ControlledSelect>
            </Grid>

            <Grid item xs={12} md={6}>
              <ControlledSelect
                control={control}
                name="Client_x0020_Type_x0020__x0028_b"
                required
                rules={{ required: true }}
                label="Client Type (B)"
                className={classes.formControl}
              // helperText="Required"
              >
                <MenuItem value="Strategic Account">Strategic Account</MenuItem>
                <MenuItem value="Regional Account">Regional Account</MenuItem>
              </ControlledSelect>
            </Grid>


          </Grid>


          {/* 8th row inputs */}
          <Grid container direction="row" justifyContent="space-around" alignItems="flex-start" spacing={2}>

            <Grid item xs={12} md={6}>
              <ControlledSelect
                control={control}
                name="RH_x0020_Client_x0020_Action"
                required={false}
                label="RH Client Action"
                className={classes.formControl}
              >
                <MenuItem value="Acquired by">Acquired by</MenuItem>
                <MenuItem value="Merged with">Merged with</MenuItem>
                <MenuItem value="Divested from">Divested from</MenuItem>
                <MenuItem value="Acquired">Acquired</MenuItem>
              </ControlledSelect>
            </Grid>

            <Grid item xs={12} md={6}>
              <ControlledTextField
                control={control}
                name="Participating_x0020_Co_x002e_"
                required={false}
                label="Participating Co. Name"
                className={classes.formControl}
              />

            </Grid>


          </Grid>


          {/* 10h row inputs */}
          <Grid container direction="row" justifyContent="space-around" alignItems="flex-start" spacing={2}>

            <Grid item xs={12} md={6}>
              <ControlledTextField
                control={control}
                name="CoRec_x0020_Impact"
                required={false}
                label="Company Records Impacted"
                defaultValue={0}
                className={classes.formControl}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ControlledTextField
                control={control}
                name="JoRec_x0020_Impact"
                required={false}
                label="Job Orders Impacted"
                defaultValue={0}
                className={classes.formControl}
              />

            </Grid>


          </Grid>

          {/* 11th row inputs */}
          <Grid container direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>

            <Grid item xs={12} md={6}>
              <ControlledTextField
                control={control}
                name="Scope_x0020_Exceptions"
                required={false}
                multiline
                rows={6}
                label="Notes"
                className={classes.formControl}
              />

              <ControlledTextField
                control={control}
                name="Analyst_x0020_Notes_x0020__x0028"
                required={false}
                multiline
                rows={6}
                label="Analyst Notes (internal)"
                className={classes.formControl}
              />

            </Grid>

            <Grid item xs={12} md={6}>

              <div style={{ marginBottom: '15px' }}>
                <input
                  accept="*"
                  ref={file}
                  className={classes.fileUploadInput}
                  id="file-upload"
                  type="file"
                  onChange={onSelectFile}
                />
                <label htmlFor="file-upload" style={{ marginRight: '15px' }}>
                  <Button variant="contained" color="primary" component="span">
                    Browse
                  </Button>
                </label>


                {fileToUpload.length > 0 &&
                  <Button variant="contained" color="primary" component="span" onClick={() => setFileToUpload([])}>
                    Clear File
                  </Button>
                }
              </div>

              {fileToUpload.length > 0 &&
                <div>
                  <Typography variant="body2" gutterBottom align="left">
                    <strong>Staged For Upload: </strong> {fileToUpload.length > 0 ? fileToUpload[0].name : null}
                  </Typography>
                </div>

              }

              {currentAttachments.length > 0 &&
                <>
                  <Typography variant="body2">
                    Current Item Attachments
                  </Typography>
                  <div>
                    <List dense={true}>
                      {currentAttachments.map((item) => (
                        <ListItem>
                          <ListItemIcon className={classes.listItemIcon}>
                            <DeleteIcon onClick={() => handleModalOpen(item.FileName)} />
                          </ListItemIcon>
                          <ListItemText>
                            <Link href={item.ServerRelativeUrl} target="_blank" rel="noreferrer">{item.FileName}</Link>
                          </ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </>
              }

            </Grid>


          </Grid>



          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>

            <pre>
              {JSON.stringify(
                { errors, isValid },
                null,
                2
              )}
            </pre>

            <Grid item>

              <div style={{ marginTop: '15px' }}>
                <Button variant="contained" color="primary" disabled={itemId === 'new' ? true : false} onClick={() => submitForm('Yes')} style={{ marginRight: '15px' }}>
                  Submit to vp
                </Button>
                <Button variant="contained" color="default" disabled={isSubmitting} onClick={() => submitForm('No')}>
                  Save
                </Button>
              </div>

            </Grid>

          </Grid>


        </Paper>
      </Container>

      {/* Snackbar/Alert popup for when user selects a value from the autocomplete component "SA / RA Client (A)" */}
      <Snackbar
        open={snackbarOpen}
        // onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="info" color="warning">
          <AlertTitle>Client Record Info</AlertTitle>
          <p>
            <b>Contract Name:</b> {Object.keys(autocompleteData).length !== 0 ? autocompleteData.contractName : null}
          </p>
          <p>
            <b>Contract Expires:</b> {Object.keys(autocompleteData).length !== 0 ? autocompleteData.contractExpires : null}
          </p>
          <p>
            <b>Country:</b> {Object.keys(autocompleteData).length !== 0 ? autocompleteData.country : null}
          </p>
          <p>
            <b>Scope:</b> {Object.keys(autocompleteData).length !== 0 ? autocompleteData.scope : null}
          </p>
          <p>
            <b>Service Type:</b> {Object.keys(autocompleteData).length !== 0 ? autocompleteData.serviceType : null}
          </p>
          <p>
            <b>AT:</b> {Object.keys(autocompleteData).length !== 0 ? autocompleteData.at : null}
          </p>
          <p>
            <b>AT - SPS:</b> {Object.keys(autocompleteData).length !== 0 ? autocompleteData.atSPS : null}
          </p>
          <p>
            <b>OT:</b> {Object.keys(autocompleteData).length !== 0 ? autocompleteData.ot : null}
          </p>
          <p>
            <b>RHFA:</b> {Object.keys(autocompleteData).length !== 0 ? autocompleteData.rhfa : null}
          </p>
          <p>
            <b>RHL:</b> {Object.keys(autocompleteData).length !== 0 ? autocompleteData.rhl : null}
          </p>
          <p>
            <b>RHMR:</b> {Object.keys(autocompleteData).length !== 0 ? autocompleteData.rhmr : null}
          </p>
          <p>
            <b>RHMR - SPS:</b> {Object.keys(autocompleteData).length !== 0 ? autocompleteData.rhmrSPS : null}
          </p>
          <p>
            <b>RHT:</b> {Object.keys(autocompleteData).length !== 0 ? autocompleteData.rht : null}
          </p>
          <p>
            <b>RHT - SPS:</b> {Object.keys(autocompleteData).length !== 0 ? autocompleteData.rhtSPS : null}
          </p>
        </Alert>
      </Snackbar>

      {/* delete current attachment confirmation modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openDeletedAttachmentModal}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 200,
        }}
      >
        <Fade in={openDeletedAttachmentModal}>
          <div className={classes.paperModal}>
            <Typography variant="h5">Delete Attachment</Typography>
            <p>
              <Typography variant="body2">Are you sure you want to delete: <em>{fileNameToDelete}</em></Typography>
            </p>
            <div>
              <Button variant="contained" color="primary" component="span" onClick={deleteItemAttachment} style={{ marginRight: '15px' }}>
                Yes
              </Button>
              <Button variant="contained" color="default" component="span" onClick={handleModalClose}>
                Cancel
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>

      {/* submit success modal */}
      {/* TODO: implement error modal, make dynamic between success and error */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openSubmissionModal}
        onClose={redirectUser}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 200,
        }}
      >
        <Fade in={openSubmissionModal}>
          <Grid container xs={2} className={classes.paperModalSubmit}>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              {
                submissionSuccess ?
                  <Typography variant="h5">{saveOrSubmit === true ? 'Submit To VP Successful' : 'Save Successful'}</Typography>
                  : <Typography variant="h5">{saveOrSubmit === true ? 'Submit To VP Failed' : 'Save Failed'}</Typography>
              }
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              {
                submissionSuccess ?
                  <CheckCircleOutlineIcon className={classes.successIcon} />
                  : <SentimentVeryDissatisfiedIcon className={classes.failureIcon} />
              }
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Button variant="contained" color="primary" component="span" onClick={redirectUser}>
                Close
              </Button>
            </Grid>
          </Grid>
        </Fade>
      </Modal>

    </Container >

  );
};



export default SaMergerTrack;
