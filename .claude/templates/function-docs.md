# Function Documentation Templates

## TypeScript/JavaScript Function

```typescript
/**
 * [Brief description of what the function does]
 * 
 * @param {Type} paramName - Description of the parameter
 * @param {Type} [optionalParam] - Description of optional parameter
 * @returns {ReturnType} Description of the return value
 * @throws {ErrorType} Description of when this error is thrown
 * 
 * @example
 * // Example usage
 * const result = functionName(param1, param2);
 */
```

## Python Function

```python
def function_name(param1: Type, param2: Type = default) -> ReturnType:
    """
    Brief description of what the function does.
    
    Args:
        param1 (Type): Description of the parameter
        param2 (Type, optional): Description of optional parameter. 
                                Defaults to default_value.
    
    Returns:
        ReturnType: Description of the return value
    
    Raises:
        ErrorType: Description of when this error is raised
    
    Example:
        >>> result = function_name(value1, value2)
        >>> print(result)
    """
```

## React Hook

```typescript
/**
 * Custom hook that [description of hook purpose].
 * 
 * @param {ConfigType} config - Configuration object for the hook
 * @returns {ReturnType} Object containing state and handlers
 * 
 * @example
 * const { state, handlers } = useCustomHook({
 *   initialValue: 'example'
 * });
 */
```

## Async Function

```typescript
/**
 * Asynchronously [description of async operation].
 * 
 * @param {Type} param - Description
 * @returns {Promise<ReturnType>} Promise that resolves to [description]
 * @throws {Error} If [condition that causes error]
 * 
 * @example
 * try {
 *   const result = await asyncFunction(param);
 * } catch (error) {
 *   console.error('Failed:', error);
 * }
 */
```