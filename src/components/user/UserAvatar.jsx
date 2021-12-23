import Avatar from '@mui/material/Avatar';

function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
function stringAvatar(naam) {
    return {
      sx: {
        bgcolor: stringToColor(naam),
        width : "30px",
        height : "30px",
        fontSize : "15px"
      },
      children: `${naam.split(' ')[0][0]}${naam.split(' ')[1][0]}`,
    };
  }
  
export default function UserAvatar({naam, achternaam}) {
    return (
            <Avatar {...stringAvatar(`${naam} ${achternaam}`)} />
    );
}