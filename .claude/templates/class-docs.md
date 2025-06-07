# Class Documentation Templates

## TypeScript/JavaScript Class

```typescript
/**
 * Brief description of the class purpose and responsibility.
 * 
 * @class ClassName
 * @implements {InterfaceName} - If implementing an interface
 * @extends {BaseClass} - If extending another class
 * 
 * @example
 * const instance = new ClassName(config);
 * instance.method();
 */
export class ClassName {
  /**
   * Creates an instance of ClassName.
   * 
   * @param {ConfigType} config - Configuration object
   * @param {Type} [optionalParam] - Optional parameter description
   * @throws {Error} If configuration is invalid
   */
  constructor(config: ConfigType, optionalParam?: Type) {
    // Implementation
  }

  /**
   * Method description.
   * 
   * @param {Type} param - Parameter description
   * @returns {ReturnType} Return value description
   * @throws {Error} Error condition description
   */
  public methodName(param: Type): ReturnType {
    // Implementation
  }

  /**
   * Private method description.
   * 
   * @private
   * @param {Type} param - Parameter description
   * @returns {ReturnType} Return value description
   */
  private privateMethod(param: Type): ReturnType {
    // Implementation
  }
}
```

## Python Class

```python
class ClassName:
    """
    Brief description of the class purpose and responsibility.
    
    This class handles [detailed description of what the class does
    and when it should be used].
    
    Attributes:
        attribute1 (Type): Description of the attribute
        attribute2 (Type): Description of the attribute
    
    Example:
        >>> instance = ClassName(config_value)
        >>> result = instance.method(param)
    """
    
    def __init__(self, param1: Type, param2: Type = default):
        """
        Initialize the ClassName instance.
        
        Args:
            param1 (Type): Description of parameter
            param2 (Type, optional): Description. Defaults to default.
        
        Raises:
            ValueError: If param1 is invalid
            TypeError: If param2 is wrong type
        """
        self.attribute1 = param1
        self.attribute2 = param2
    
    def public_method(self, param: Type) -> ReturnType:
        """
        Brief description of what the method does.
        
        Args:
            param (Type): Description of the parameter
        
        Returns:
            ReturnType: Description of return value
        
        Raises:
            ErrorType: When this error occurs
        """
        # Implementation
    
    def _private_method(self, param: Type) -> ReturnType:
        """
        Private method description (single underscore for internal use).
        
        Args:
            param (Type): Description
        
        Returns:
            ReturnType: Description
        """
        # Implementation
    
    @property
    def computed_property(self) -> Type:
        """
        Get the computed property value.
        
        Returns:
            Type: Description of the property value
        """
        return self._compute_value()
    
    @staticmethod
    def static_method(param: Type) -> ReturnType:
        """
        Static method that [description].
        
        Args:
            param (Type): Description
        
        Returns:
            ReturnType: Description
        """
        # Implementation
    
    @classmethod
    def from_config(cls, config: Dict[str, Any]) -> 'ClassName':
        """
        Create instance from configuration dictionary.
        
        Args:
            config (Dict[str, Any]): Configuration dictionary
        
        Returns:
            ClassName: New instance configured from dictionary
        
        Raises:
            KeyError: If required config keys are missing
        """
        # Implementation
```

## Interface Documentation (TypeScript)

```typescript
/**
 * Interface describing the shape of [what it represents].
 * 
 * @interface InterfaceName
 * @extends {BaseInterface} - If extending another interface
 */
export interface InterfaceName {
  /**
   * Description of the property
   */
  propertyName: Type;
  
  /**
   * Optional property description
   */
  optionalProperty?: Type;
  
  /**
   * Method signature description
   * 
   * @param param - Parameter description
   * @returns Return value description
   */
  methodName(param: Type): ReturnType;
}
```

## Abstract Class (TypeScript)

```typescript
/**
 * Abstract base class for [description of what implementations should do].
 * 
 * @abstract
 * @class AbstractClassName
 */
export abstract class AbstractClassName {
  /**
   * Abstract method that must be implemented by subclasses.
   * 
   * @abstract
   * @param {Type} param - Parameter description
   * @returns {ReturnType} Expected return value
   */
  abstract abstractMethod(param: Type): ReturnType;
  
  /**
   * Concrete method available to all subclasses.
   * 
   * @protected
   * @param {Type} param - Parameter description
   * @returns {ReturnType} Return value description
   */
  protected concreteMethod(param: Type): ReturnType {
    // Implementation
  }
}
```