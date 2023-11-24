import { CenterContent, Dropdown, DropdownContent, NavBar, NavLink, NavText, SiteName, TextButton, useThemeContext } from 'gobble-lib-react';
import styled from 'styled-components';

const UserIcon = styled.i`
    font-size: 32px;
`;

export const TopNav = () => {
    const { theme, setTheme } = useThemeContext();

    return (
        <NavBar>
            <SiteName to='/'>AOC 2023</SiteName>
            <CenterContent>
                <NavLink link='/'>Home</NavLink>
                <Dropdown>
                    <NavText>Day</NavText>
                    <DropdownContent>
                        <NavLink link='/day/0'>Day 0</NavLink>
                        <NavLink link='/day/1'>Day 1</NavLink>
                    </DropdownContent>
                </Dropdown>
            </CenterContent>
            <Dropdown>
                <UserIcon className='fas fa-cog' />
                <DropdownContent sideAnchor='right'>
                    <TextButton onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</TextButton>
                </DropdownContent>
            </Dropdown>
        </NavBar>
    );
};