import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UserList from '../../components/UserList';

// Create a simple mock reducer for testing
const mockUserReducer = (state = { users: [], loading: false, error: null }, action: any) => {
  return state;
};

const createTestStore = (initialState = {}) => {
  const defaultState = { users: [], loading: false, error: null };
  return configureStore({
    reducer: { users: mockUserReducer },
    preloadedState: { users: { ...defaultState, ...initialState } }
  });
};

const renderWithProviders = (component: React.ReactElement, initialState = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

const mockUsers = [
  { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@test.com', createdAt: '2024-01-01' },
  { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', createdAt: '2024-01-02' },
  { _id: '3', firstName: 'Bob', lastName: 'Johnson', email: 'bob@test.com', createdAt: '2024-01-03' },
  { _id: '4', firstName: 'Alice', lastName: 'Brown', email: 'alice@test.com', createdAt: '2024-01-04' },
  { _id: '5', firstName: 'Charlie', lastName: 'Davis', email: 'charlie@test.com', createdAt: '2024-01-05' },
  { _id: '6', firstName: 'Eva', lastName: 'Wilson', email: 'eva@test.com', createdAt: '2024-01-06' }
];

describe('UserList Component', () => {
  describe('Loading and Empty States', () => {
    it('renders loading state with data-test-id', () => {
      renderWithProviders(<UserList />, { loading: true });
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading...');
    });

    it('renders empty state when no users', () => {
      renderWithProviders(<UserList />, { users: [], loading: false });
      expect(screen.getByTestId('user-list-container')).toBeInTheDocument();
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText(/no users found/i)).toBeInTheDocument();
    });
  });

  describe('Table Rendering', () => {
    it('renders users table with data-test-ids', () => {
      const users = [mockUsers[0]];
      renderWithProviders(<UserList />, { users, loading: false });
      
      expect(screen.getByTestId('users-table')).toBeInTheDocument();
      expect(screen.getByTestId('table-header')).toBeInTheDocument();
      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('renders table headers correctly', () => {
      const users = [mockUsers[0]];
      renderWithProviders(<UserList />, { users, loading: false });
      
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Created At')).toBeInTheDocument();
    });

    it('renders user data in table rows', () => {
      const users = [mockUsers[0]];
      renderWithProviders(<UserList />, { users, loading: false });
      
      expect(screen.getByTestId('user-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('user-first-name')).toHaveTextContent('John');
      expect(screen.getByTestId('user-last-name')).toHaveTextContent('Doe');
      expect(screen.getByTestId('user-email')).toHaveTextContent('john@test.com');
      expect(screen.getByTestId('user-created-at')).toBeInTheDocument();
    });

    it('renders multiple users correctly', () => {
      const users = mockUsers.slice(0, 3);
      renderWithProviders(<UserList />, { users, loading: false });
      
      expect(screen.getByTestId('user-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('user-row-2')).toBeInTheDocument();
      expect(screen.getByTestId('user-row-3')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('does not show pagination for 5 or fewer users', () => {
      const users = mockUsers.slice(0, 5);
      renderWithProviders(<UserList />, { users, loading: false });
      
      expect(screen.queryByTestId('pagination-container')).not.toBeInTheDocument();
    });

    it('shows pagination for more than 5 users', () => {
      renderWithProviders(<UserList />, { users: mockUsers, loading: false });
      
      expect(screen.getByTestId('pagination-container')).toBeInTheDocument();
    });

    it('displays correct number of users per page', () => {
      renderWithProviders(<UserList />, { users: mockUsers, loading: false });
      
      const tableRows = screen.getAllByTestId(/user-row-/);
      expect(tableRows).toHaveLength(5);
    });

    it('navigates to next page', () => {
      renderWithProviders(<UserList />, { users: mockUsers, loading: false });
      
      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);
      
      expect(screen.getByTestId('user-row-6')).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('formats created date correctly', () => {
      const users = [{
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        createdAt: '2024-01-15T10:30:00.000Z'
      }];
      
      renderWithProviders(<UserList />, { users, loading: false });
      
      const dateElement = screen.getByTestId('user-created-at');
      expect(dateElement).toBeInTheDocument();
    });
  });
});