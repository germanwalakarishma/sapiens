import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import CreateUser from '../../components/CreateUser';
import userReducer from '../../store/userSlice';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const createTestStore = () => configureStore({
  reducer: { users: userReducer }
});

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('CreateUser Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockClear();
    mockNavigate.mockClear();
  });

  describe('Rendering', () => {
    it('renders form container with correct data-test-id', () => {
      renderWithProviders(<CreateUser />);
      expect(screen.getByTestId('create-user-form')).toBeInTheDocument();
      expect(screen.getByTestId('user-form')).toBeInTheDocument();
    });

    it('renders all form fields with data-test-ids', () => {
      renderWithProviders(<CreateUser />);
      
      expect(screen.getByTestId('first-name-input')).toBeInTheDocument();
      expect(screen.getByTestId('last-name-input')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });
  });

  describe('First Name Validation', () => {
    it('validates first name with numbers', async () => {
      renderWithProviders(<CreateUser />);
      
      const firstNameInput = screen.getByTestId('first-name-input');
      fireEvent.change(firstNameInput, { target: { value: 'John123' } });
      
      await waitFor(() => {
        expect(screen.getByTestId('first-name-error')).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(screen.getByTestId('first-name-error')).toHaveTextContent('Must contain only letters');
      });
    });

    it('validates first name with special characters', async () => {
      renderWithProviders(<CreateUser />);
      
      const firstNameInput = screen.getByTestId('first-name-input');
      fireEvent.change(firstNameInput, { target: { value: 'John@' } });
      
      await waitFor(() => {
        expect(screen.getByTestId('first-name-error')).toBeInTheDocument();
      });
    });

    it('validates first name length over 100 characters', async () => {
      renderWithProviders(<CreateUser />);
      
      const longName = 'a'.repeat(101);
      const firstNameInput = screen.getByTestId('first-name-input');
      fireEvent.change(firstNameInput, { target: { value: longName } });
      
      await waitFor(() => {
        expect(screen.getByTestId('first-name-error')).toHaveTextContent('Must be 100 characters or less');
      });
    });
  });

  describe('Last Name Validation', () => {
    it('validates last name field', async () => {
      renderWithProviders(<CreateUser />);
      
      const lastNameInput = screen.getByTestId('last-name-input');
      fireEvent.change(lastNameInput, { target: { value: 'Doe@' } });
      
      await waitFor(() => {
        expect(screen.getByTestId('last-name-error')).toBeInTheDocument();
      });
    });
  });

  describe('Email Validation', () => {
    it('validates email format', async () => {
      renderWithProviders(<CreateUser />);
      
      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      
      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toHaveTextContent('Must be a valid email address');
      });
    });
  });

  describe('Form Submission', () => {
    it('accepts valid form data', async () => {
      renderWithProviders(<CreateUser />);
      
      fireEvent.change(screen.getByTestId('first-name-input'), { target: { value: 'John' } });
      fireEvent.change(screen.getByTestId('last-name-input'), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
      
      await waitFor(() => {
        expect(screen.queryByTestId('first-name-error')).not.toBeInTheDocument();
      });
      await waitFor(() => {
        expect(screen.queryByTestId('last-name-error')).not.toBeInTheDocument();
      });
      await waitFor(() => {
        expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
      });
    });

    it('prevents form submission with validation errors', async () => {
      renderWithProviders(<CreateUser />);
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('first-name-error')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId('last-name-error')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument();
      });
    });

    it('submits form with valid data successfully', async () => {
      mockDispatch.mockReturnValue({ unwrap: () => Promise.resolve() });
      renderWithProviders(<CreateUser />);
      
      fireEvent.change(screen.getByTestId('first-name-input'), { target: { value: 'John' } });
      fireEvent.change(screen.getByTestId('last-name-input'), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
      fireEvent.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });
    });

    it('handles general server errors', async () => {
      const serverError = 'Email already exists';
      mockDispatch.mockReturnValue({ unwrap: () => Promise.reject(serverError) });
      renderWithProviders(<CreateUser />);
      
      fireEvent.change(screen.getByTestId('first-name-input'), { target: { value: 'John' } });
      fireEvent.change(screen.getByTestId('last-name-input'), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
      fireEvent.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('general-error')).toHaveTextContent('Email already exists');
      });
    });

    it('clears errors when valid input is entered', async () => {
      renderWithProviders(<CreateUser />);
      
      const firstNameInput = screen.getByTestId('first-name-input');
      fireEvent.change(firstNameInput, { target: { value: 'John123' } });
      
      await waitFor(() => {
        expect(screen.getByTestId('first-name-error')).toBeInTheDocument();
      });
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      
      await waitFor(() => {
        expect(screen.queryByTestId('first-name-error')).not.toBeInTheDocument();
      });
    });

    it('shows success message after successful submission', async () => {
      mockDispatch.mockReturnValue({ unwrap: () => Promise.resolve() });
      renderWithProviders(<CreateUser />);
      
      fireEvent.change(screen.getByTestId('first-name-input'), { target: { value: 'John' } });
      fireEvent.change(screen.getByTestId('last-name-input'), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
      fireEvent.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
      });
    });

    it('navigates after successful submission', async () => {
      jest.useFakeTimers();
      mockDispatch.mockReturnValue({ unwrap: () => Promise.resolve() });
      renderWithProviders(<CreateUser />);
      
      fireEvent.change(screen.getByTestId('first-name-input'), { target: { value: 'John' } });
      fireEvent.change(screen.getByTestId('last-name-input'), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
      fireEvent.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });
      
      jest.advanceTimersByTime(2000);
      expect(mockNavigate).toHaveBeenCalledWith('/');
      jest.useRealTimers();
    });

    it('handles unknown field names in validation', () => {
      renderWithProviders(<CreateUser />);
      
      const input = screen.getByTestId('first-name-input');
      fireEvent.change(input, { target: { name: 'unknownField', value: 'test' } });
      
      expect(screen.queryByTestId('first-name-error')).not.toBeInTheDocument();
    });

  });
});