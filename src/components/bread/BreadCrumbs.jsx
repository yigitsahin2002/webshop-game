import React from "react";
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link,
  Typography
} from "@mui/material";
import { withRouter } from "react-router-dom";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useGames } from "../../contexts/GamesProvider";
import { usePublishers } from "../../contexts/PublisherProvider";
import { usePlatforms } from "../../contexts/PlatformProvider";
import { useCategorieen } from "../../contexts/CategorieProvider";

const Breadcrumbs = (props) => {
  const {games} = useGames();
  const {publishers} = usePublishers();
  const {platforms} = usePlatforms();
  const {categorieen} = useCategorieen();
  const {
    history,
    location: { pathname }
  } = props;
  const pathnames = pathname.split("/").filter((x) => x);
  return (
    <MUIBreadcrumbs sx={{paddingLeft : "5px"}} aria-label="breadcrumb" separator={<KeyboardArrowRightIcon/>}>
      {pathnames.map((name, index) => {
        let path = name;
        
        if (games && publishers && platforms && categorieen){
          if (pathnames[0] === "browse"){
          if ((games && pathnames[index-1] === "games")){
            if (index === pathnames.length - 1){
              path = games?.find(g => g.id === name)?.naam;
            }
          }
          if (platforms && pathnames[index-1] === "platforms"){
            if (index === pathnames.length - 1){
              path = platforms.find(p => p.id === name)?.naam;
            }
          }
          if (publishers && pathnames[index-1] === "publishers"){
            if (index === pathnames.length - 1){
              path = publishers.find(p => p.id === name)?.naam;
            }
          }
          if (categorieen && pathnames[index-1] === "categorieen"){
            if (index === pathnames.length - 1){
              path = categorieen.find(c => c.id === name)?.naam;
            }
          }
        }
      }
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <div key={name} className="align-center">
            <Typography>{path}</Typography>
          </div>
        ) : (
          <div key={name} className="align-center">
            <Link
              color="inherit"
              className="link"
              onClick={() => history.push(routeTo)}
            >
            {path}
            </Link>
          </div>
        );
      })} 
    </MUIBreadcrumbs>
  );
};

export default withRouter(Breadcrumbs);
