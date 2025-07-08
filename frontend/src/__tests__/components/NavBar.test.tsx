import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../../components/NavBar';

const renderWithRouter = (component: React.ReactElement, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('NavBar Component', () => {
  describe('Rendering', () => {
    it('renders navbar with data-test-id', () => {
      renderWithRouter(<NavBar />);
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('renders logo with data-test-id', () => {
      renderWithRouter(<NavBar />);
      expect(screen.getByTestId('navbar-logo')).toBeInTheDocument();
      expect(screen.getByTestId('navbar-logo')).toHaveTextContent('👥 User Management');
    });

    it('renders navigation links container', () => {
      renderWithRouter(<NavBar />);
      expect(screen.getByTestId('navbar-links')).toBeInTheDocument();
    });

    it('renders users list link', () => {
      renderWithRouter(<NavBar />);
      expect(screen.getByTestId('users-list-link')).toBeInTheDocument();
      expect(screen.getByTestId('users-list-link')).toHaveTextContent('Users List');
    });

    it('renders create user link', () => {
      renderWithRouter(<NavBar />);
      expect(screen.getByTestId('create-user-link')).toBeInTheDocument();
      expect(screen.getByTestId('create-user-link')).toHaveTextContent('Create User');
    });

    it('shows and hides the menu when the hamburger is clicked', () => {
      renderWithRouter(<NavBar />);

      const hamburger   = screen.getByTestId('navbar-hamburger');
      const linksHolder = screen.getByTestId('navbar-links');

      expect(linksHolder).toHaveClass('hidden');

      fireEvent.click(hamburger);
      expect(linksHolder).toHaveClass('flex');
      expect(linksHolder).not.toHaveClass('hidden');

      fireEvent.click(hamburger);
      expect(linksHolder).toHaveClass('hidden');
    });

    it('closes the menu when a nav link is clicked', () => {
      renderWithRouter(<NavBar />);

      const hamburger = screen.getByTestId('navbar-hamburger');
      const usersLink = screen.getByTestId('users-list-link');
      const linksMenu = screen.getByTestId('navbar-links');

      fireEvent.click(hamburger);
      expect(linksMenu).toHaveClass('flex');

      fireEvent.click(usersLink);

      expect(linksMenu).toHaveClass('hidden');
    });
    it('closes the menu when Create User link is clicked', () => {
      renderWithRouter(<NavBar />);

      const hamburger = screen.getByTestId('navbar-hamburger');
      const createLink = screen.getByTestId('create-user-link');
      const linksContainer = screen.getByTestId('navbar-links');

      fireEvent.click(hamburger);
      expect(linksContainer).toHaveClass('flex');

      fireEvent.click(createLink);

      expect(linksContainer).toHaveClass('hidden');
    });

  });

  describe('Navigation Links', () => {
    it('has correct href attributes', () => {
      renderWithRouter(<NavBar />);
      
      expect(screen.getByTestId('navbar-logo')).toHaveAttribute('href', '/');
      expect(screen.getByTestId('users-list-link')).toHaveAttribute('href', '/');
      expect(screen.getByTestId('create-user-link')).toHaveAttribute('href', '/create');
    });
  });

  describe('Active State Styling', () => {
    it('applies active styling to users list link when on home page', () => {
      renderWithRouter(<NavBar />, ['/']);
      
      const usersListLink = screen.getByTestId('users-list-link');
      expect(usersListLink).toHaveClass('bg-white', 'text-gray-900', 'font-semibold');
      
      const createUserLink = screen.getByTestId('create-user-link');
      expect(createUserLink).toHaveClass('hover:bg-gray-800', 'hover:text-white');
    });

    it('applies active styling to create user link when on create page', () => {
      renderWithRouter(<NavBar />, ['/create']);
      
      const createUserLink = screen.getByTestId('create-user-link');
      expect(createUserLink).toHaveClass('bg-white', 'text-gray-900', 'font-semibold');
      
      const usersListLink = screen.getByTestId('users-list-link');
      expect(usersListLink).toHaveClass('hover:bg-gray-800', 'hover:text-white');
    });
  });

  describe('Accessibility', () => {
    it('has proper navigation role', () => {
      renderWithRouter(<NavBar />);
      const navbar = screen.getByTestId('navbar');
      expect(navbar.tagName).toBe('NAV');
    });

    it('links are keyboard accessible', () => {
      renderWithRouter(<NavBar />);
      
      const logoLink = screen.getByTestId('navbar-logo');
      const usersListLink = screen.getByTestId('users-list-link');
      const createUserLink = screen.getByTestId('create-user-link');
      
      expect(logoLink).toHaveAttribute('href');
      expect(usersListLink).toHaveAttribute('href');
      expect(createUserLink).toHaveAttribute('href');
    });
  });
});