# React Component Documentation Templates

## Functional Component

```typescript
/**
 * Brief description of what the component displays/does.
 * 
 * @component
 * @param {ComponentProps} props - The component props
 * 
 * @example
 * <ComponentName
 *   requiredProp="value"
 *   optionalProp={42}
 *   onAction={(data) => console.log(data)}
 * />
 */
export const ComponentName: React.FC<ComponentProps> = ({ 
  requiredProp, 
  optionalProp = defaultValue,
  onAction 
}) => {
  // Component implementation
};

/**
 * Props for the ComponentName component.
 * 
 * @interface ComponentProps
 */
interface ComponentProps {
  /**
   * Required prop description - what it controls/displays
   */
  requiredProp: string;
  
  /**
   * Optional prop description - include default value info
   * @default defaultValue
   */
  optionalProp?: number;
  
  /**
   * Callback fired when [describe when this fires]
   * @param data - Description of callback parameter
   */
  onAction?: (data: DataType) => void;
  
  /**
   * Children elements to render inside the component
   */
  children?: React.ReactNode;
}
```

## Component with State & Effects

```typescript
/**
 * Complex component that manages [describe what it manages].
 * Handles [list key responsibilities].
 * 
 * @component
 * @param {ComplexComponentProps} props - Component props
 * 
 * @example
 * // Basic usage
 * <ComplexComponent
 *   data={userData}
 *   onUpdate={handleUpdate}
 * />
 * 
 * @example
 * // With all options
 * <ComplexComponent
 *   data={userData}
 *   onUpdate={handleUpdate}
 *   variant="compact"
 *   showDetails={true}
 *   customStyles={styles}
 * />
 */
export const ComplexComponent: React.FC<ComplexComponentProps> = ({
  data,
  onUpdate,
  variant = 'default',
  showDetails = false,
  customStyles
}) => {
  /**
   * State for tracking [what the state tracks]
   */
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Effect that [describe what the effect does]
   */
  useEffect(() => {
    // Effect implementation
  }, [dependency]);
  
  /**
   * Handles [describe what this handler does]
   * 
   * @param {EventType} event - The event object
   */
  const handleAction = useCallback((event: EventType) => {
    // Handler implementation
  }, [dependencies]);
  
  return (
    // JSX
  );
};
```

## Custom Hook Component Documentation

```typescript
/**
 * Component that uses custom hook for [purpose].
 * Provides [what it provides to users].
 * 
 * @component
 * @param {HookedComponentProps} props - Component props
 * 
 * @example
 * <HookedComponent
 *   config={{ theme: 'dark' }}
 *   onStateChange={(state) => console.log(state)}
 * />
 */
export const HookedComponent: React.FC<HookedComponentProps> = ({ config, onStateChange }) => {
  /**
   * Custom hook for managing [what it manages]
   * @see {@link useCustomHook} for hook documentation
   */
  const { state, actions } = useCustomHook(config);
  
  // Component implementation
};
```

## Compound Component Pattern

```typescript
/**
 * Main component that provides context for child components.
 * Implements compound component pattern for [use case].
 * 
 * @component
 * @param {CompoundComponentProps} props - Component props
 * 
 * @example
 * <CompoundComponent>
 *   <CompoundComponent.Header title="Title" />
 *   <CompoundComponent.Body>
 *     Content goes here
 *   </CompoundComponent.Body>
 *   <CompoundComponent.Footer>
 *     <Button>Action</Button>
 *   </CompoundComponent.Footer>
 * </CompoundComponent>
 */
export const CompoundComponent: React.FC<CompoundComponentProps> & {
  Header: typeof Header;
  Body: typeof Body;
  Footer: typeof Footer;
} = ({ children, ...props }) => {
  // Main component implementation
};

/**
 * Header subcomponent for CompoundComponent.
 * 
 * @component
 * @param {HeaderProps} props - Header props
 */
const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  // Header implementation
};

/**
 * Body subcomponent for CompoundComponent.
 * 
 * @component  
 * @param {BodyProps} props - Body props
 */
const Body: React.FC<BodyProps> = ({ children }) => {
  // Body implementation
};

// Attach subcomponents
CompoundComponent.Header = Header;
CompoundComponent.Body = Body;
CompoundComponent.Footer = Footer;
```

## Memoized Component

```typescript
/**
 * Performance-optimized component that [description].
 * Memoized to prevent unnecessary re-renders when [conditions].
 * 
 * @component
 * @param {MemoizedComponentProps} props - Component props
 * 
 * @example
 * <MemoizedComponent
 *   data={largeDataSet}
 *   renderItem={(item) => <Item {...item} />}
 * />
 */
export const MemoizedComponent = React.memo<MemoizedComponentProps>(({ 
  data, 
  renderItem 
}) => {
  /**
   * Memoized computation for [what it computes]
   */
  const processedData = useMemo(() => {
    return data.filter(item => item.active);
  }, [data]);
  
  /**
   * Memoized callback for [what it does]
   */
  const handleClick = useCallback((id: string) => {
    // Handler implementation
  }, []);
  
  return (
    // JSX
  );
}, (prevProps, nextProps) => {
  // Custom comparison function (optional)
  return prevProps.data === nextProps.data;
});

MemoizedComponent.displayName = 'MemoizedComponent';
```

## Form Component

```typescript
/**
 * Form component for [purpose of the form].
 * Handles validation, submission, and error states.
 * 
 * @component
 * @param {FormComponentProps} props - Form component props
 * 
 * @example
 * <FormComponent
 *   initialValues={{ name: '', email: '' }}
 *   onSubmit={async (values) => {
 *     await api.submit(values);
 *   }}
 *   onCancel={() => navigate(-1)}
 * />
 */
export const FormComponent: React.FC<FormComponentProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  validationSchema
}) => {
  /**
   * Form state management using custom hook
   */
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  } = useForm({
    initialValues,
    validationSchema,
    onSubmit
  });
  
  return (
    // Form JSX
  );
};
```