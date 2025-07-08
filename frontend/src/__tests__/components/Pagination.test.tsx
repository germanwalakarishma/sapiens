import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../../components/Pagination';

const mockOnPageChange = jest.fn();

const defaultProps = {
  currentPage: 1,
  totalPages: 5,
  onPageChange: mockOnPageChange,
};

describe('Pagination Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders pagination container with data-test-id', () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('renders previous button with data-test-id', () => {
      render(<Pagination {...defaultProps} />);
      const prevBtn = screen.getByTestId('previous-button');
      expect(prevBtn).toBeInTheDocument();
      expect(prevBtn).toHaveTextContent('Previous');
    });

    it('renders next button with data-test-id', () => {
      render(<Pagination {...defaultProps} />);
      const nextBtn = screen.getByTestId('next-button');
      expect(nextBtn).toBeInTheDocument();
      expect(nextBtn).toHaveTextContent('Next');
    });

    it('renders the correct range of page number buttons', () => {
      render(<Pagination {...defaultProps} currentPage={3} />);
      const expectedPages = [2, 3, 4];

      expectedPages.forEach((page) => {
        expect(screen.getByTestId(`page-button-${page}`)).toBeInTheDocument();
        expect(screen.getByTestId(`page-button-${page}`)).toHaveTextContent(page.toString());
      });

      // Ensure out-of-range pages are not present
      expect(screen.queryByTestId('page-button-1')).toBeNull();
      expect(screen.queryByTestId('page-button-5')).toBeNull();
    });
  });

  describe('Button States', () => {
    it('disables previous button on first page', () => {
      render(<Pagination {...defaultProps} currentPage={1} />);
      expect(screen.getByTestId('previous-button')).toBeDisabled();
    });

    it('enables previous button when not on first page', () => {
      render(<Pagination {...defaultProps} currentPage={2} />);
      expect(screen.getByTestId('previous-button')).not.toBeDisabled();
    });

    it('disables next button on last page', () => {
      render(<Pagination {...defaultProps} currentPage={5} />);
      expect(screen.getByTestId('next-button')).toBeDisabled();
    });

    it('enables next button when not on last page', () => {
      render(<Pagination {...defaultProps} currentPage={4} />);
      expect(screen.getByTestId('next-button')).not.toBeDisabled();
    });
  });

  describe('Active Page Styling', () => {
    it('applies active styling to current page button', () => {
      render(<Pagination {...defaultProps} currentPage={3} />);
      const activeButton = screen.getByTestId('page-button-3');
      expect(activeButton).toHaveClass('bg-gray-900', 'text-white');
    });

    it('applies inactive styling to non-current page buttons', () => {
      render(<Pagination {...defaultProps} currentPage={3} />);
      const inactiveButton = screen.getByTestId('page-button-2');
      expect(inactiveButton).toHaveClass('bg-gray-200', 'text-gray-700');
    });
  });

  describe('Click Handlers', () => {
    it('calls onPageChange with previous page when previous button clicked', () => {
      render(<Pagination {...defaultProps} currentPage={3} />);
      fireEvent.click(screen.getByTestId('previous-button'));
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageChange with next page when next button clicked', () => {
      render(<Pagination {...defaultProps} currentPage={3} />);
      fireEvent.click(screen.getByTestId('next-button'));
      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it('calls onPageChange with correct page when page button clicked', () => {
      render(<Pagination {...defaultProps} currentPage={1} />);
      fireEvent.click(screen.getByTestId('page-button-2'));
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('does not call onPageChange when disabled previous button clicked', () => {
      render(<Pagination {...defaultProps} currentPage={1} />);
      fireEvent.click(screen.getByTestId('previous-button'));
      expect(mockOnPageChange).not.toHaveBeenCalled();
    });

    it('does not call onPageChange when disabled next button clicked', () => {
      render(<Pagination {...defaultProps} currentPage={5} />);
      fireEvent.click(screen.getByTestId('next-button'));
      expect(mockOnPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles single page correctly', () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={1} />);
      expect(screen.getByTestId('previous-button')).toBeDisabled();
      expect(screen.getByTestId('next-button')).toBeDisabled();

      const pageBtn = screen.getByTestId('page-button-1');
      expect(pageBtn).toBeInTheDocument();
      expect(pageBtn).toHaveClass('bg-gray-900', 'text-white');

      expect(screen.queryByTestId('page-button-2')).toBeNull();
    });

    it('renders a subset of pages when totalPages is large', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);
      const expectedPages = [4, 5, 6];

      expectedPages.forEach((page) => {
        expect(screen.getByTestId(`page-button-${page}`)).toBeInTheDocument();
      });

      expect(screen.queryByTestId('page-button-1')).toBeNull();
      expect(screen.queryByTestId('page-button-10')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('buttons are keyboard accessible', () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByTestId('previous-button').tagName).toBe('BUTTON');
      expect(screen.getByTestId('next-button').tagName).toBe('BUTTON');
      expect(screen.getByTestId('page-button-1').tagName).toBe('BUTTON');
    });
  });
});
