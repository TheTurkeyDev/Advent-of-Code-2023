import { CenterContent, Dropdown, DropdownContent, NavBar, NavLink, NavText, SiteName, TextButton, useThemeContext } from 'gobble-lib-react';
import styled from 'styled-components';

const UserIcon = styled.i`
    font-size: 32px;
`;

export const TopNav = () => {
    const { theme, setTheme } = useThemeContext();

    return (
        <NavBar>
            <SiteName to='/'>Advent of Code</SiteName>
            <CenterContent>
                <NavLink link='/'>Home</NavLink>
                <Dropdown>
                    <NavText>2024</NavText>
                    <DropdownContent>
                        <NavLink link='/2024/14'>Day 14</NavLink>
                        <NavLink link='/2024/15'>Day 15</NavLink>
                    </DropdownContent>
                </Dropdown>
                <Dropdown>
                    <NavText>2023</NavText>
                    <DropdownContent>
                        <NavLink link='/2023/1'>Day 1</NavLink>
                        <NavLink link='/2023/10'>Day 10</NavLink>
                        <NavLink link='/2023/13'>Day 13</NavLink>
                        <NavLink link='/2023/15'>Day 15</NavLink>
                    </DropdownContent>
                </Dropdown>
                <Dropdown>
                    <NavText>2015</NavText>
                    <DropdownContent>
                        <NavLink link='/2015/1'>Day 1</NavLink>
                        <NavLink link='/2015/6'>Day 6</NavLink>
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