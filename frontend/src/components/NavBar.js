import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Nav = styled.nav`
  display: flex;
  align-items: center;
  background-color: #2e3241;
  width: 100%;
  padding: 1rem;
  justify-content: space-between;
  box-sizing: border-box;
`;

const NavLink = styled(Link)`
  margin: 0 1.5rem;
  padding: 0.5rem 1rem;
  color: #f5f5f5;
  text-decoration: none;
  font-weight: bold;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  background-color: ${({ active }) => (active ? '#4a90e2' : 'transparent')};
  text-decoration: ${({ active }) => (active ? 'underline' : 'none')};

  &:hover {
    background-color: #4a90e2;
  }
`;

const ProfileContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  color: #f5f5f5;
  cursor: pointer;
  font-size: 2rem; /* Increased font size for better visibility */
  margin-left: 1rem; /* Add left margin for spacing */
  padding: 0.5rem; /* Add padding to ensure it's clickable and not cut off */

  &:hover {
    color: #4a90e2;
  }
`;

const DropdownMenu = styled.div`
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: absolute;
  top: 2.5rem;
  right: 0;
  background-color: #4a90e2;
  min-width: 150px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  z-index: 1000;
`;

const DropdownItem = styled(Link)`
  color: #f5f5f5;
  padding: 10px;
  display: block;
  text-decoration: none;

  &:hover {
    background-color: #6aa7e6;
    color: #f5f5f5;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #f5f5f5;
  padding: 10px;
  width: 100%;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #6aa7e6;
  }
`;

const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();
  
    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };
  
    const handleLogout = () => {
      // Logic for logout (e.g., removing token from localStorage)
      localStorage.removeItem('token');
      navigate('/');
    };
  
    // Close dropdown if clicked outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    return (
      <Nav>
        <div>
          <NavLink to="/dashboard" active={location.pathname === '/dashboard' ? 'true' : ''}>
            Dashboard
          </NavLink>
          <NavLink to="/buy-sell" active={location.pathname === '/buy-sell' ? 'true' : ''}>
            Trade
          </NavLink>
          <NavLink to="/leaderboard" active={location.pathname === '/leaderboard' ? 'true' : ''}>
            Leaderboard
          </NavLink>
        </div>
        <ProfileContainer ref={dropdownRef}>
          <ProfileButton onClick={toggleDropdown}>
            <FaUserCircle />
          </ProfileButton>
          <DropdownMenu open={dropdownOpen}>
            <DropdownItem to="/account-settings">Account Settings</DropdownItem>
            <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
          </DropdownMenu>
        </ProfileContainer>
      </Nav>
    );
  };
  
  export default NavBar;