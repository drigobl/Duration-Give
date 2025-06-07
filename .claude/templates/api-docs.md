# API Documentation Templates

## REST API Endpoint (Python/Flask)

```python
@app.route('/api/resource/<resource_id>', methods=['GET'])
@require_auth
def get_resource(resource_id: str) -> Response:
    """
    Retrieve a specific resource by ID.
    
    Endpoint: GET /api/resource/<resource_id>
    
    Args:
        resource_id (str): Unique identifier for the resource
    
    Headers:
        Authorization: Bearer token required
        Accept: application/json
    
    Query Parameters:
        include (str, optional): Comma-separated list of relations to include
        fields (str, optional): Comma-separated list of fields to return
    
    Returns:
        Response: JSON response with resource data
            Success (200):
            {
                "id": "string",
                "name": "string",
                "created_at": "ISO-8601 datetime",
                "updated_at": "ISO-8601 datetime",
                "metadata": {}
            }
    
    Raises:
        401: Unauthorized - Invalid or missing auth token
        403: Forbidden - User lacks permission to access resource
        404: Not Found - Resource with given ID doesn't exist
        500: Internal Server Error
    
    Example:
        GET /api/resource/res_123?include=owner,tags&fields=id,name
        
        Response:
        {
            "id": "res_123",
            "name": "Example Resource",
            "owner": { ... },
            "tags": [ ... ]
        }
    """
    # Implementation
```

## REST API Endpoint (TypeScript/Express)

```typescript
/**
 * Create a new donation record.
 * 
 * @route POST /api/donations
 * @group Donations - Donation management endpoints
 * @security BearerAuth
 * 
 * @param {CreateDonationRequest.model} request.body.required - Donation details
 * @returns {DonationResponse.model} 201 - Donation created successfully
 * @returns {ErrorResponse.model} 400 - Invalid request data
 * @returns {ErrorResponse.model} 401 - Unauthorized
 * @returns {ErrorResponse.model} 500 - Internal server error
 * 
 * @example request - Example request body
 * {
 *   "charityId": "charity_123",
 *   "amount": 100.50,
 *   "currency": "USD",
 *   "recurring": false
 * }
 * 
 * @example response - 201 - Success response
 * {
 *   "id": "don_456",
 *   "charityId": "charity_123",
 *   "donorId": "user_789",
 *   "amount": 100.50,
 *   "currency": "USD",
 *   "status": "pending",
 *   "createdAt": "2024-03-15T10:30:00Z"
 * }
 */
router.post('/api/donations', authenticate, async (req: Request, res: Response) => {
  // Implementation
});
```

## GraphQL Resolver

```typescript
/**
 * Resolver for fetching charity organization details.
 * 
 * @param {any} parent - Parent resolver result
 * @param {GetCharityArgs} args - Query arguments
 * @param {Context} context - GraphQL context with user info
 * @returns {Promise<Charity>} Charity organization data
 * @throws {UserInputError} If charity ID is invalid
 * @throws {ForbiddenError} If user lacks access permission
 */
export const getCharity = async (
  parent: any,
  args: GetCharityArgs,
  context: Context
): Promise<Charity> => {
  /**
   * Validate charity ID format
   */
  if (!isValidCharityId(args.id)) {
    throw new UserInputError('Invalid charity ID format');
  }
  
  /**
   * Check user permissions
   */
  if (!context.user.hasPermission('charity.read')) {
    throw new ForbiddenError('Insufficient permissions');
  }
  
  // Implementation
};

/**
 * Arguments for getCharity query.
 * 
 * @interface GetCharityArgs
 */
interface GetCharityArgs {
  /** Unique charity identifier */
  id: string;
  /** Include related data */
  include?: string[];
}
```

## WebSocket Handler

```typescript
/**
 * Handle real-time donation notifications via WebSocket.
 * 
 * @event donation:new
 * @param {Socket} socket - Socket.io client socket
 * @param {DonationData} data - New donation data
 * 
 * @emits donation:confirmed - When donation is confirmed on blockchain
 * @emits donation:failed - When donation processing fails
 * 
 * @example
 * // Client-side
 * socket.emit('donation:new', {
 *   charityId: 'charity_123',
 *   amount: 50,
 *   message: 'Keep up the great work!'
 * });
 * 
 * socket.on('donation:confirmed', (confirmation) => {
 *   console.log('Donation confirmed:', confirmation.transactionHash);
 * });
 */
io.on('connection', (socket: Socket) => {
  socket.on('donation:new', async (data: DonationData) => {
    try {
      /**
       * Validate donation data
       */
      const validation = validateDonationData(data);
      if (!validation.valid) {
        socket.emit('donation:failed', { error: validation.error });
        return;
      }
      
      /**
       * Process donation
       */
      const result = await processDonation(data);
      
      /**
       * Emit confirmation to donor
       */
      socket.emit('donation:confirmed', {
        transactionHash: result.hash,
        timestamp: new Date().toISOString()
      });
      
      /**
       * Broadcast to charity
       */
      socket.to(`charity:${data.charityId}`).emit('donation:received', {
        amount: data.amount,
        donorId: socket.userId
      });
      
    } catch (error) {
      socket.emit('donation:failed', { 
        error: 'Failed to process donation' 
      });
    }
  });
});
```

## API Service Class

```typescript
/**
 * Service class for interacting with the Give Protocol API.
 * Handles authentication, request formatting, and response parsing.
 * 
 * @class ApiService
 * 
 * @example
 * const api = new ApiService({ 
 *   baseURL: 'https://api.giveprotocol.org',
 *   apiKey: process.env.API_KEY 
 * });
 * 
 * const charities = await api.getCharities({ verified: true });
 */
export class ApiService {
  /**
   * Create a new API service instance.
   * 
   * @param {ApiConfig} config - API configuration
   * @throws {Error} If required config is missing
   */
  constructor(config: ApiConfig) {
    // Implementation
  }
  
  /**
   * Fetch list of charities with optional filtering.
   * 
   * @param {GetCharitiesParams} [params] - Query parameters
   * @returns {Promise<PaginatedResponse<Charity>>} Paginated charity list
   * @throws {ApiError} If request fails
   * 
   * @example
   * const response = await api.getCharities({
   *   verified: true,
   *   category: 'education',
   *   limit: 20,
   *   offset: 0
   * });
   */
  async getCharities(params?: GetCharitiesParams): Promise<PaginatedResponse<Charity>> {
    // Implementation
  }
  
  /**
   * Submit a new donation.
   * 
   * @param {CreateDonationParams} donation - Donation parameters
   * @returns {Promise<Donation>} Created donation record
   * @throws {ValidationError} If donation data is invalid
   * @throws {PaymentError} If payment processing fails
   * @throws {ApiError} If API request fails
   */
  async createDonation(donation: CreateDonationParams): Promise<Donation> {
    // Implementation
  }
}
```

## Webhook Handler

```python
@app.route('/webhooks/payment', methods=['POST'])
@validate_webhook_signature
def handle_payment_webhook() -> Response:
    """
    Handle payment provider webhook notifications.
    
    Endpoint: POST /webhooks/payment
    
    Headers:
        X-Webhook-Signature: HMAC signature for request validation
        Content-Type: application/json
    
    Request Body:
        {
            "event": "payment.completed",
            "data": {
                "payment_id": "pay_123",
                "amount": 100.00,
                "currency": "USD",
                "metadata": {}
            },
            "timestamp": "2024-03-15T10:30:00Z"
        }
    
    Returns:
        Response: Acknowledgment response
            Success (200): {"status": "received"}
            
    Webhook Events:
        - payment.completed: Payment successfully processed
        - payment.failed: Payment processing failed
        - payment.refunded: Payment was refunded
        - payment.disputed: Payment dispute opened
    
    Error Responses:
        400: Bad Request - Invalid webhook data
        401: Unauthorized - Invalid signature
        500: Internal Server Error - Processing failed
    
    Example:
        POST /webhooks/payment
        Headers:
            X-Webhook-Signature: sha256=abcd1234...
            Content-Type: application/json
        
        Body:
        {
            "event": "payment.completed",
            "data": {
                "payment_id": "pay_123",
                "amount": 50.00,
                "currency": "USD",
                "metadata": {
                    "donation_id": "don_456",
                    "charity_id": "charity_789"
                }
            }
        }
    """
    # Implementation
```