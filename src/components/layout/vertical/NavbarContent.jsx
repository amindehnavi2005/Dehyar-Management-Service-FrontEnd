"use client";
import React from 'react';
import classnames from 'classnames';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import NavToggle from './NavToggle';
import ModeDropdown from '@components/layout/shared/ModeDropdown';
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses';
import {toast} from "react-toastify";
import UserDropdown from "@components/layout/shared/UserDropdown";

const NavbarContent = () => {

    return (
        <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
            <div className='flex items-center gap-[7px]'>
                <NavToggle />
            </div>
            <div className='flex items-center'>
                <ModeDropdown />
                <UserDropdown />
            </div>
        </div>
    );
};

export default NavbarContent;
