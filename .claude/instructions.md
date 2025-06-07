# Project Documentation Standards

## Overview
This document outlines the documentation requirements for all code in the Duration-Give project. All functions, classes, and methods must include comprehensive documentation comments.

## JavaScript/TypeScript Documentation (JSDoc)

### Functions
```typescript
/**
 * Calculates the donation amount in fiat currency based on crypto amount and exchange rate.
 * 
 * @param {number} cryptoAmount - The amount of cryptocurrency to convert
 * @param {number} exchangeRate - Current exchange rate (crypto to fiat)
 * @param {string} [currency='USD'] - Target fiat currency code
 * @returns {number} The calculated fiat amount rounded to 2 decimal places
 * @throws {Error} If cryptoAmount or exchangeRate is negative
 * 
 * @example
 * const fiatAmount = calculateFiatValue(1.5, 2000, 'USD');
 * // Returns: 3000.00
 */
export function calculateFiatValue(
  cryptoAmount: number, 
  exchangeRate: number, 
  currency: string = 'USD'
): number {
  if (cryptoAmount < 0 || exchangeRate < 0) {
    throw new Error('Amount and exchange rate must be non-negative');
  }
  return Number((cryptoAmount * exchangeRate).toFixed(2));
}
```

### Classes
```typescript
/**
 * Manages wallet connections and blockchain interactions for the Give Protocol.
 * Handles MetaMask integration and network switching for Moonbase Alpha.
 * 
 * @class WalletManager
 * @implements {IWalletManager}
 * 
 * @example
 * const walletManager = new WalletManager();
 * await walletManager.connect();
 */
export class WalletManager implements IWalletManager {
  /**
   * Creates a new WalletManager instance.
   * 
   * @param {ethers.Provider} [provider] - Optional ethers provider instance
   * @param {WalletConfig} [config] - Optional wallet configuration
   */
  constructor(provider?: ethers.Provider, config?: WalletConfig) {
    // Implementation
  }

  /**
   * Connects to the user's MetaMask wallet.
   * 
   * @returns {Promise<string>} The connected wallet address
   * @throws {Error} If MetaMask is not installed or user rejects connection
   * 
   * @example
   * try {
   *   const address = await walletManager.connect();
   *   console.log('Connected:', address);
   * } catch (error) {
   *   console.error('Connection failed:', error);
   * }
   */
  async connect(): Promise<string> {
    // Implementation
  }
}
```

### React Components
```typescript
/**
 * Displays a charity card with organization details and donation button.
 * Supports verified badge display and responsive image loading.
 * 
 * @component
 * @param {CharityCardProps} props - The component props
 * 
 * @example
 * <CharityCard 
 *   charity={charityData}
 *   onDonate={(id) => handleDonation(id)}
 *   featured={true}
 * />
 */
export const CharityCard: React.FC<CharityCardProps> = ({ charity, onDonate, featured }) => {
  // Component implementation
};

/**
 * Props for the CharityCard component.
 * 
 * @interface CharityCardProps
 */
interface CharityCardProps {
  /** The charity organization data */
  charity: Charity;
  /** Callback function triggered when donate button is clicked */
  onDonate?: (charityId: string) => void;
  /** Whether to display the card with featured styling */
  featured?: boolean;
}
```

## Python Documentation (Docstrings)

### Functions
```python
def calculate_donation_metrics(donations: List[Donation], period: str = 'month') -> DonationMetrics:
    """
    Calculate aggregate donation metrics for a given time period.
    
    Args:
        donations (List[Donation]): List of donation records to analyze
        period (str, optional): Time period for aggregation. 
                               Options: 'day', 'week', 'month', 'year'. 
                               Defaults to 'month'.
    
    Returns:
        DonationMetrics: Object containing total amount, count, and average donation
    
    Raises:
        ValueError: If period is not a valid option
        TypeError: If donations is not a list of Donation objects
    
    Example:
        >>> donations = fetch_donations(user_id=123)
        >>> metrics = calculate_donation_metrics(donations, 'year')
        >>> print(f"Total donated: ${metrics.total_amount}")
    """
    # Implementation
```

### Classes
```python
class DonationAnalyzer:
    """
    Analyzes donation patterns and generates insights for the Give Protocol.
    
    This class provides methods for analyzing donation trends, identifying
    patterns, and generating reports for both donors and charities.
    
    Attributes:
        connection (DatabaseConnection): Database connection instance
        cache_ttl (int): Cache time-to-live in seconds
    
    Example:
        >>> analyzer = DonationAnalyzer(connection=db_conn)
        >>> trends = analyzer.get_trending_charities(limit=10)
    """
    
    def __init__(self, connection: DatabaseConnection, cache_ttl: int = 3600):
        """
        Initialize the DonationAnalyzer.
        
        Args:
            connection (DatabaseConnection): Active database connection
            cache_ttl (int, optional): Cache TTL in seconds. Defaults to 3600.
        
        Raises:
            ConnectionError: If database connection is invalid
        """
        # Implementation
    
    def get_trending_charities(self, limit: int = 10, timeframe: str = '7d') -> List[TrendingCharity]:
        """
        Get list of trending charities based on recent donation activity.
        
        Args:
            limit (int, optional): Maximum number of results. Defaults to 10.
            timeframe (str, optional): Time window for analysis. Defaults to '7d'.
                                     Format: '{number}{unit}' where unit is d/w/m/y
        
        Returns:
            List[TrendingCharity]: Sorted list of trending charities
        
        Raises:
            ValueError: If timeframe format is invalid
            DatabaseError: If query execution fails
        """
        # Implementation
```

## Best Practices

### 1. Be Concise but Complete
- Write clear, single-line summaries
- Add detailed descriptions only when necessary
- Focus on the "what" and "why", not the "how"

### 2. Document All Parameters
- Include type information
- Describe acceptable values or ranges
- Note optional parameters and defaults
- Explain parameter relationships

### 3. Document Return Values
- Specify the return type
- Describe what the return value represents
- Note special cases (null, undefined, empty)

### 4. Document Exceptions/Errors
- List all exceptions that might be thrown
- Explain when each exception occurs
- Include error handling examples when helpful

### 5. Include Examples
- Add practical usage examples
- Show both basic and advanced usage
- Include error handling examples for complex functions

### 6. Use Proper Types
- Use TypeScript types instead of JSDoc types when possible
- Be specific with union types and interfaces
- Document generic type parameters

### 7. Keep Documentation Updated
- Update docs when function behavior changes
- Remove documentation for deleted code
- Ensure examples remain valid

## Special Cases

### Hooks Documentation
```typescript
/**
 * Custom hook for managing donation form state and validation.
 * Handles form submission, validation, and error states.
 * 
 * @param {DonationFormConfig} config - Initial form configuration
 * @returns {DonationFormReturn} Form state and handler functions
 * 
 * @example
 * const { values, errors, handleSubmit } = useDonationForm({
 *   defaultAmount: 100,
 *   charityId: 'charity123'
 * });
 */
export function useDonationForm(config: DonationFormConfig): DonationFormReturn {
  // Implementation
}
```

### Utility Functions
```typescript
/**
 * Formats a date string into compact YYYY/MM/DD HH:MM format.
 * 
 * @param {string} dateString - ISO date string to format
 * @param {boolean} includeTime - Whether to include time in output
 * @param {boolean} compact - Use compact format (YYYY/MM/DD HH:MM)
 * @returns {string} Formatted date string
 * 
 * @example
 * formatDate('2024-03-15T10:30:00Z', true, true);
 * // Returns: "2024/03/15 10:30"
 */
export function formatDate(
  dateString: string, 
  includeTime: boolean = false, 
  compact: boolean = false
): string {
  // Implementation
}
```

### API Endpoints (Python)
```python
@app.route('/api/donations/<charity_id>/stats')
def get_donation_stats(charity_id: str) -> Response:
    """
    Get donation statistics for a specific charity.
    
    Endpoint: GET /api/donations/<charity_id>/stats
    
    Args:
        charity_id (str): Unique identifier for the charity
    
    Query Parameters:
        period (str, optional): Time period for stats. Default: 'month'
        currency (str, optional): Currency for amounts. Default: 'USD'
    
    Returns:
        Response: JSON response with donation statistics
            {
                "total_amount": float,
                "donation_count": int,
                "average_donation": float,
                "top_donors": list,
                "trend": str
            }
    
    Raises:
        404: If charity_id is not found
        400: If query parameters are invalid
        500: If internal server error occurs
    
    Example:
        GET /api/donations/charity123/stats?period=year&currency=EUR
    """
    # Implementation
```

## Documentation Tools

### TypeScript/JavaScript
- Use JSDoc format for all documentation
- Configure TSDoc for TypeScript projects
- Enable documentation linting in ESLint

### Python
- Use Google-style or NumPy-style docstrings consistently
- Configure docstring linting with pylint or flake8
- Generate API documentation with Sphinx

## Enforcement

1. **Code Reviews**: All PRs must include proper documentation
2. **Linting**: Enable documentation linting rules
3. **CI/CD**: Fail builds for missing documentation
4. **IDE Support**: Configure IDEs to show documentation warnings

## Templates

Store common documentation templates in `.claude/templates/`:
- `function-docs.md` - Function documentation template
- `class-docs.md` - Class documentation template
- `component-docs.md` - React component documentation template
- `api-docs.md` - API endpoint documentation template