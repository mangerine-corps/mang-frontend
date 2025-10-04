// @ts-nocheck
import React, { FC, useEffect, useRef, useState } from "react";
import { Box, Text, Button, HStack, Flex, InputGroup, Input, Portal } from "@chakra-ui/react";
import {
  OptionBase,
  ChakraStylesConfig,
  AsyncSelect,
  chakraComponents,
  InputProps,
} from "chakra-react-select";
import { isEmpty } from "lodash";
import { BiCheck, BiChevronDown, BiChevronUp, BiSearch } from "react-icons/bi";
import { outfit } from "mangarine/pages/_app";

const { MenuList, SingleValue, Placeholder, ValueContainer, MultiValue } =
  chakraComponents;
interface OptionGroup extends OptionBase {
  label: string;
  value: string;
}

const asyncComponents = {
  LoadingIndicator: (props: any) => (
    <chakraComponents.LoadingIndicator
      // The color of the main line which makes up the spinner
      // This could be accomplished using `chakraStyles` but it is also available as a custom prop
      color="currentColor" // <-- This default's to your theme's text color (Light mode: gray.700 | Dark mode: whiteAlpha.900)
      // The color of the remaining space that makes up the spinner
      emptyColor="transparent"
      // The `size` prop on the Chakra spinner
      // Defaults to one size smaller than the Select's size
      spinnerSize="md"
      // A CSS <time> variable (s or ms) which determines the time it takes for the spinner to make one full rotation
      speed="0.45s"
      // A CSS size string representing the thickness of the spinner's line
      thickness="2px"
      // Don't forget to forward the props!
      {...props}
    />
  ),
  NoOptionMessage: (props: any) => (
    <chakraComponents.NoOptionsMessage {...props}>
      <Button>No options</Button>
    </chakraComponents.NoOptionsMessage>
  ),
};
export const DropdownIndicator = (props: any) => {
  const { selectProps } = props;
  const { menuIsOpen } = selectProps;
  return (
    <chakraComponents.DropdownIndicator {...props}>
      {menuIsOpen ? <BiChevronUp /> : <BiChevronDown />}
    </chakraComponents.DropdownIndicator>
  );
};
const CInput = (props: InputProps<any, true>) => {
  if (props.isHidden) {
    return <chakraComponents.Input {...props} />;
  }
  return (
    <Box display={"none"}>
      <chakraComponents.Input {...props} />
    </Box>
  );
};
const CustomValueContainer = ({ children, selectProps, ...props }) => {
  const commonProps = {
    cx: props.cx,
    clearValue: props.clearValue,
    getStyles: props.getStyles,
    getValue: props.getValue,
    hasValue: props.hasValue,
    isMulti: props.isMulti,
    isRtl: props.isRtl,
    options: props.options,
    selectOption: props.selectOption,
    setValue: props.setValue,
    selectProps,
    theme: props.theme,
  };

  return (
    <ValueContainer {...props} selectProps={selectProps}>
      {React.Children.map(children, (child) => {
        return child ? (
          <HStack flexDir={"row"}>
            <Box ml={0.5} width={"auto"}>
              {child}
            </Box>
          </HStack>
        ) : props.hasValue ? (
          <SingleValue {...commonProps} isFocused={false} isDisabled={true}>
            {selectProps.getOptionLabel(props.getValue()[0])}
          </SingleValue>
        ) : (
          <Placeholder
            {...commonProps}
            key="placeholder"
            isDisabled={true}
            isFocused={false}
            data={props.getValue()}
          >
            {/* {selectProps.placeholder} */}
          </Placeholder>
        );
      })}
    </ValueContainer>
  );
};
const CustomList = (props: any) => {
  const { selectProps } = props;
  const { loadNext, totalPage, page } = selectProps;
  return (
    <chakraComponents.MenuList {...props}>
      <Box borderWidth={0}>
        {props.children}
        {page < totalPage && (
          <Button mx={"4"} size={"md"} w="92%" onClick={loadNext}>
            <Text className="font-mullish" fontSize={15}>
              Load Next
            </Text>
          </Button>
        )}
      </Box>
    </chakraComponents.MenuList>
  );
};

const CustomMenuList = ({ selectProps, ...props }) => {
  const {
    onInputChange,
    inputValue,
    onMenuInputFocus,
    loadNext,
    totalPage,
    page,
  } = selectProps;

  // Copied from source
  const ariaAttributes = {
    "aria-autocomplete": "list",
    "aria-label": selectProps["aria-label"],
    "aria-labelledby": selectProps["aria-labelledby"],
  };
  return (
    <Box rounded={"15px"} bg="white">
      <InputGroup
        _hover={{
          borderColor: "gray.50",
        }}
        bg="white"
        borderWidth={1}
        rounded={"15px"}
        borderColor={"gray.50"}
        width={"full"}
        startElement={
          <Box p={0.5} ml={2}>
            <BiSearch />
          </Box>
        }
      >
        <Input
          value={inputValue}
          onChange={(e) =>
            onInputChange(e.currentTarget.value, {
              action: "input-change",
            })
          }
          rounded={"6px"}
          onMouseDown={(e: any) => {
            e.stopPropagation();
            e.target.focus();
          }}
          onTouchEnd={(e: any) => {
            e.stopPropagation();
            e.target.focus();
          }}
          onFocus={onMenuInputFocus}
          placeholder="Search..."
          {...ariaAttributes}
          type="text"
        />
      </InputGroup>
      
      <MenuList {...props} selectProps={selectProps}>
        {props.children}
        {page < totalPage && (
          <Button mx={"2"} my={3} size={"md"} w="92%" onClick={loadNext}>
            <Text className={outfit.className} fontSize={15}>
              Load Next
            </Text>
          </Button>
        )}
      </MenuList>
    </Box>
  );
};

const Option = (props: OptionProps<ColourOption>) => {
  const { selectProps, selectOption, hasValue, innerProps, getValue } = props;

  return (
    <chakraComponents.Option {...props}>
      <HStack
        py={2}
        w="full"
        justifyContent={"flex-start"}
        alignItems={"center"}
      >
        <Flex
          bg={
            !isEmpty(getValue().find((item) => item.label === props.children))
              ? "text_primary"
              : "transparent"
          }
          rounded={"lg"}
          alignItems={"center"}
          justifyContent={"center"}
          height={5}
          width={5}
          borderWidth={1}
        >
          <BiCheck color="white" />
        </Flex>
        <Text className="text1" fontSize={"15px"} fontWeight={"400"}>
          {props.children}
        </Text>
      </HStack>
    </chakraComponents.Option>
  );
};

interface FormValues {
  options: OptionGroup[];
  value: any;
  name: string;
  onChange: any;
  onBlur: any;
  error: any;
  label: React.ReactElement;
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  loadingOptions?: any;
  isMulti?: boolean;
  isBasic?: boolean;
  placeholder: string;
  fontSize?: string;
  isSearchable: boolean;
  closeOnSelect?: boolean;
  allowOptionsUpdate?: boolean; //enable this if options will be updated
}

const AsyncMultiSelect: FC<FormValues> = ({
  options,
  value,
  name,
  onChange,
  onBlur,
  error,
  label,
  size = "md",
  isDisabled = false,
  isMulti = true,
  isBasic = true,
  placeholder = "",
  fontSize = "0.875rem",
  isSearchable = "false",
  closeOnSelect = false,
  indicatorTopMargin = "0",
  multiSelectHeight = "100%",
  multiSelectWidth = "250px",
  allowOptionsUpdate = false,
}) => {
  const [totalPage, setTotalPage] = useState(Math.ceil(options.length / 100));
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [currentOptions, setCurrentOptions] = useState([]);
  const containerRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  // useEffect(() => {
  // }, [onChange]);
  // const [opti, setPage] = useState()
  const chakraStyles: ChakraStylesConfig = {
    dropdownIndicator: (provided, state) => ({
      ...provided,
      p: 0,
      w: "40px",
      h: multiSelectHeight,
      alignSelf: "self-start",
      marginTop: indicatorTopMargin,
    }),
    clearIndicator: (provided, state) => ({
      ...provided,
      p: 0,
      w: "40px",
      display: "none",
    }),
    control: (base, state) => ({
      ...base,
      borderWidth: 1,
      borderColor: "gray.50",
      rounded: "6px",
      _active: {
        borderWidth: 1,
        borderColor: "gray.50",
        outline: "none",
      },
      _focusVisible: {
        borderWidth: 1,
        borderColor: "gray.50",
        outline: "none",
      },

      outline: "none",
    }),
    inputContainer: (provided, state) => ({
      ...provided,
      _focus: {
        borderWidth: 0,
        borderColor: "red.600",
        outline: "none",
      },
      w: "full",
      borderRadius: "60px",
      _focusWithin: {
        borderWidth: 0,
        borderColor: "red.900",
        outline: "none",
      },
    }),
    container: (provided, state) => ({
      ...provided,
      borderWidth: 0,
      size: "sm",
      // boxShadow: "md",
      borderColor: "gray.100",
      w: "full",
      minW: {
        lg: "200px",
        "2xl": "200px",
      },
      fontSize,
      borderRadius: "60px",
      _hover: {
        border: "none",
        borderWidth: 0,
        outline: "none",
      },
      _focus: {
        borderWidth: 0,
        borderColor: "red.600",
        outline: "none",
      },
      _focusWithin: {
        borderWidth: 0,
        borderColor: "red.900",
        outline: "none",
      },
    }),
    placeholder: (provided, state) => ({
      ...provided,
      width: "100%",
      fontSize: "15px",
      color: "gray.300",
      fontWeight: "400",
      position: "absolute",
      _focus: {
        border: "0px",
        borderColor: "transparent",
        outline: "none",
      },
      _focusVisible: {
        outline: "none",
      },
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      fontSize: "0.875rem",
      fontWeight: "400",
      // h:'25px',
      py: 2.5,
      mb: 0,
      // bg: 'red.500',
    }),

    menu: (provided, state) => ({
      ...provided,
      fontSize: "0.875rem",
      fontWeight: "400",
      borderWidth: 0,
    }),
    menuList: (provided, state) => ({
      ...provided,
      fontSize: "0.875rem",
      fontWeight: "400",
      shadow: "lg",
      borderWidth: 0,
      boxShadow: "lg",
      paddingVertical: 0,

      zIndex: "max",
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "1rem",

      fontWeight: "400",
      paddingLeft: 5,
      py: 0,
      noOfLines: 1,
      _hover: {
        bg: "primary.50",
      },
      color: "black",
      _selected: {
        bg: "transparent",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "main_background",
      color: "text_primary",
      border: "text_primary",
      fontSize: "1rem",
      p: "2",
      fontWeight: "400",
      css: {
        fontFamily: "lato",
      },
      // maxW: '50%'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "black",
      fontSize: "1rem",
      fontWeight: "400",
    }),
  };

  const loadNext = () => {
    const nextOptions = filteredOptions.slice(0, currentPage * 100);
    setCurrentPage(currentPage + 1);
    setCurrentOptions(nextOptions);
  };
  const onDomClick = (e) => {
    let menu = containerRef.current.querySelector(".react-select__menu");

    if (
      !containerRef.current.contains(e.target) ||
      !menu ||
      !menu.contains(e.target)
    ) {
      setIsFocused(false);
      setInputValue("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", onDomClick);

    return () => {
      document.removeEventListener("mousedown", onDomClick);
    };
  }, []);

  // eslint-disable react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isEmpty(options) && (allowOptionsUpdate || isEmpty(currentOptions))) {
      setFilteredOptions(options);
      const nextOptions = options.slice(0, currentPage * 100);
      setTotalPage(Math.ceil(options.length / 100));
      setCurrentPage(currentPage + 1);
      setCurrentOptions(nextOptions);
    }
  }, [options,allowOptionsUpdate,]); 

  useEffect(() => {}, [currentOptions, currentPage, filteredOptions]);

  return (
    <>
      <Portal
        container={containerRef}
        w={"full"}
        zIndex={"max"}
        position={"relative"}
        ref={containerRef}
      >
        {label && label}
        <Box
          zIndex={"max"}
          borderColor={
            !isEmpty(error)
              ? "error.100"
              : !isEmpty(value)
                ? "text_primary"
                : "input_border"
          }
          borderWidth={1.5}
          borderRadius={"md"}
          pl={2}
          w="full"
        >
          {currentOptions && (
            <AsyncSelect
              //@ts-ignore
              isMulti={isMulti}
              name={name}
              // ref={ref}
              size={size}
              components={{
                ...asyncComponents,
                // MenuList: CustomList,
                DropdownIndicator,
                Option,
                MenuList: CustomMenuList,
                ValueContainer: CustomValueContainer,
                Input: CInput,
              }}
              onChange={onChange}
              onBlur={onBlur}
              defaultOptions={currentOptions}
              options={currentOptions}
              loadOptions={(inputValue, callback) => {
                if (!isEmpty(inputValue)) {
                  setTimeout(() => {
                    const values = options.filter((i: any) =>
                      i.label.toLowerCase().includes(inputValue.toLowerCase())
                    );
                    setFilteredOptions(values);
                    setCurrentPage(1);
                    setTotalPage(Math.ceil(values.length / 100));
                    callback(values.slice(0, 100));
                  }, 1000);
                } else {
                  setFilteredOptions(options);
                  setCurrentOptions(1);
                  setTotalPage(Math.ceil(options.length / 100));
                  loadNext();
                }
              }}
              focusBorderColor="primary.900"
              //@ts-ignore
              isSearchable={false}
              chakraStyles={chakraStyles}
              useBasicStyles={isBasic}
              // _hover={{ borderWidth: 1, borderColor: "primary.900" }}
              // _focus={{ borderWidth: 1, borderColor: "primary.900" }}
              // _focusVisible={{ borderWidth: 1, borderColor: "primary.900" }}
              isReadOnly={isDisabled}
              value={value}
              hideSelectedOptions={false}
              placeholder={placeholder}
              closeMenuOnSelect={closeOnSelect}
              page={currentPage}
              loadNext={loadNext}
              totalPage={totalPage}
              onMenuInputFocus={() => setIsFocused(true)}
              // menuIsOpen={false}

              // isDisabled={true}
              isHidden={true}
              // onChange={() => setIsFocused(false)}
              onInputChange={(val) => setInputValue(val)}
              {...{
                menuIsOpen: isFocused || undefined,
                isFocused: isFocused || undefined,
              }}
            />
          )}
        </Box>

        <Text color="error.400">
          {error && error?.message}
        </Text>
      </Portal>
      <Box ref={containerRef}></Box>
    </>
  );
};

export default AsyncMultiSelect;
