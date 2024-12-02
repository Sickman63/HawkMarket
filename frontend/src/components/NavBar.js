import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

// Navbar Container Styling
const Nav = styled.nav`
  display: flex;
  align-items: center;
  background-color: #1f1f1f;
  width: 100%;
  padding: 1rem 2rem;
  justify-content: space-between;
  box-sizing: border-box;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

// Navigation Link Styling
const NavLink = styled(Link)`
  margin: 0 1.5rem;
  padding: 0.5rem 1rem;
  color: #f0f0f0;
  text-decoration: none;
  font-weight: bold;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: ${({ active }) => (active ? '#336699' : 'transparent')};
  text-decoration: ${({ active }) => (active ? 'underline' : 'none')};

  &:hover {
    background-color: #295680;
  }

  @media (max-width: 768px) {
    margin: 0 1rem;
    padding: 0.5rem;
  }
`;

// Profile Container and Button Styling
const ProfileContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  color: #f0f0f0;
  cursor: pointer;
  font-size: 2rem;
  margin-left: 1.5rem;

  &:hover {
    color: #336699;
  }
`;

// Dropdown Menu Styling
const DropdownMenu = styled.div`
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: absolute;
  top: 3.5rem;
  right: 0;
  background-color: #295680; /* Darkened blue for better contrast */
  min-width: 160px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  z-index: 1000;
`;

// Dropdown Item Styling
const DropdownItem = styled(Link)`
  color: #e0e0e0; /* Use a slightly off-white color for better readability */
  padding: 10px;
  display: block;
  text-decoration: none;

  &:hover {
    background-color: #3d7ba8; /* Slightly darker shade for hover */
    color: #ffffff;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #e0e0e0; /* Match the text color with the dropdown item */
  padding: 10px;
  width: 100%;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #3d7ba8;
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
