import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../Authentication/AuthContext";
import { useLocation } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "60ch",
    },
  },
}));

export default function CombinedAppBar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleProfileMenuOpen = (event) => {
    if (event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLoginClick = (event) => {
    event.preventDefault();
    navigate("/login", { state: { from: location }, replace: true });
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = anchorEl && (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          navigate(`/account/${user.user_id}`);
        }}
      >
        My Account
      </MenuItem>
      <MenuItem onClick={() => navigate(`/account/subscribed/${user.user_id}`)}>
        My Events
      </MenuItem>
      {user.staff && (
        <>
          <MenuItem onClick={() => navigate(`/staff/createEvent`)}>
            Create Event
          </MenuItem>
          <MenuItem onClick={() => navigate(`/staff/addStaff`)}>
            Add Staff
          </MenuItem>
        </>
      )}
      <MenuItem
        onClick={() => {
          handleMenuClose();
          logout();
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = mobileMoreAnchorEl && (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {user ? (
        <>
          <MenuItem onClick={() => navigate(`/account/${user.user_id}`)}>
            <Typography variant="body1">My Account</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => navigate(`/account/subscribed/${user.user_id}`)}
          >
            <Typography variant="body1">My Events</Typography>
          </MenuItem>
          {user.staff && (
            <>
              <MenuItem onClick={() => navigate(`/staff/createEvent`)}>
                <Typography variant="body1">Create Event</Typography>
              </MenuItem>
              <MenuItem onClick={() => navigate(`/staff/addStaff`)}>
                <Typography variant="body1">Add Staff</Typography>
              </MenuItem>
            </>
          )}
          <MenuItem
            onClick={() => {
              handleMobileMenuClose();
              logout();
            }}
          >
            <Typography variant="body1">Logout</Typography>
          </MenuItem>
        </>
      ) : (
        <MenuItem onClick={handleLoginClick}>
          <Typography variant="body1">Login</Typography>
        </MenuItem>
      )}
    </Menu>
  );

  const handleSearch = (event) => {
    event.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("query", searchValue);
    if (searchValue) {
      navigate(`/search/${searchValue}?${newSearchParams.toString()}`);
    }
  };

  const returnHome = () => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#00008B",
          color: "#ffffff",
        }}
      >
        <Toolbar sx={{ minHeight: "64px !important" }}>
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <IconButton
              size="large"
              aria-label="home"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={returnHome}
              color="inherit"
            >
              <HomeIcon />
            </IconButton>
          </Box>
          <Typography
            onClick={returnHome}
            variant="h6"
            noWrap
            component="a"
            sx={{
              display: { xs: "none", sm: "block" },
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            TheCommunityHub
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <form onSubmit={handleSearch}>
              <StyledInputBase
                placeholder="Search…"
                value={searchValue}
                onChange={handleChange}
                inputProps={{ "aria-label": "search" }}
                sx={{
                  color: "white",
                  "&::placeholder": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              />
            </form>
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <>
            {user ? (
              <>
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                </Box>
                <Box sx={{ display: { xs: "flex", md: "none" } }}>
                  <IconButton
                    size="large"
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                  >
                    <MoreIcon />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Typography
                variant="body1"
                sx={{
                  cursor: "pointer",
                  color: "inherit",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={handleLoginClick}
              >
                Sign in
              </Typography>
            )}
          </>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
