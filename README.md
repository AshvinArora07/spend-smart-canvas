
# SpendSmart - Personal Finance Tracker

## Overview

SpendSmart is a dynamic personal finance tracking web application built with React, TypeScript, and modern web technologies. It helps users manage their income, expenses, and savings through an intuitive interface with visual charts and detailed transaction management.

## Features

- **User Authentication**: Secure login and registration system
- **Financial Dashboard**: Overview of income, expenses, savings, and available balance
- **Transaction Management**: Add, delete, and categorize financial transactions
- **Data Visualization**: Charts to visualize spending patterns and financial trends
- **Responsive Design**: Works seamlessly across mobile, tablet, and desktop devices
- **Custom Categories**: Create and manage custom categories for different transaction types
- **Sorting and Filtering**: Sort transactions by date, amount, or category, and filter by transaction type
- **Local Storage**: Transactions persist between sessions using browser storage

## Technologies Used

- **Frontend**:
  - React 18
  - TypeScript
  - TailwindCSS for styling
  - Shadcn UI components
  - React Hook Form for form handling
  - Zod for form validation
  - Recharts for data visualization
  - Lucide React for iconography

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn

### Installation

1. Clone the repository
```sh
git clone https://github.com/yourusername/spendsmart.git
cd spendsmart
```

2. Install dependencies
```sh
npm install
# or
yarn install
```

3. Start the development server
```sh
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Adding Transactions

1. Click the "New Transaction" button in the header
2. Select the transaction type (income, expense, or savings)
3. Choose or create a category
4. Enter the amount
5. Add a description
6. Select the date
7. Submit the form

### Managing Transactions

- View all transactions in the "Recent Transactions" section
- Filter transactions by type using the dropdown
- Sort transactions by date, amount, or category
- Delete transactions by clicking the trash icon

### Viewing Financial Summary

The dashboard displays:
- Current balance
- Total income
- Total expenses
- Total savings
- Monthly charts showing financial trends
- Expense breakdown by category

## Customization

### Adding New Categories

1. Select a transaction type
2. Click "Add custom category" in the category dropdown
3. Enter your new category name
4. Click "Add"

### Theming

The application uses a financial-themed color scheme which can be customized in the `tailwind.config.ts` file.

## Deployment

To build the application for production:

```sh
npm run build
# or
yarn build
```

The build output will be in the `dist` directory, ready to be deployed to any static hosting service.

## Future Enhancements

- Cloud synchronization
- Budget planning and alerts
- Financial goal setting and tracking
- Receipt scanning functionality
- Export data as CSV/PDF
- Multiple currency support

## License

This project is licensed under the MIT License - see the LICENSE file for details.
