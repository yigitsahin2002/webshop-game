import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useCallback } from 'react';
import { useUsers } from '../../contexts/UsersProvider';
import { useLogout, useSession } from "../../contexts/AuthProvider";

export default function ConfirmDialog({open, changeOpen = (f) => f}) {

  const {
      deleteUser,
  } = useUsers();

  const logout = useLogout();

  const { user } = useSession();
  const { id } = user ?? "";

  const handleClose = useCallback(() => {
    changeOpen(false);
  }, [changeOpen]);

  const handleDelete = useCallback(async() => {
    changeOpen(false);
    await deleteUser(id);
    logout();
  }, [changeOpen, deleteUser, id, logout])

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete user account?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you wish to delete your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleDelete} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}