import { createSystem, defaultConfig } from "@chakra-ui/react";

// const config = defineConfig({});

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        success: {
          50: { value: "#E6F6F4" },
          100: { value: "#B0E4DD" },
          200: { value: "#8AD7CC" },
          300: { value: "#54C5B5" },
          400: { value: "#33BAA7" },
          500: { value: "#00A991" },
          600: { value: "#009A84" },
          700: { value: "#007867" },
          800: { value: "#005D50" },
          900: { value: "#00473D" },
        },
        primary: {
          50: { value: "#E7E8ED" },
          100: { value: "#B5B9C7" },
          200: { value: "#9297AC" },
          300: { value: "#606886" },
          400: { value: "#414A6E" },
          500: { value: "#414A6E" },
          600: { value: "#0F1A43" },
          700: { value: "#0C1535" },
          800: { value: "#091029" },
          900: { value: "#070C1F" },
          950: { value: "#111D4A" },
        },
        secondary: {
          50: { value: "#FFFAF5" },
          100: { value: "#FFF0DF" },
          200: { value: "#FFE9D0" },
          300: { value: "#FFDFBB" },
          400: { value: "#FFD9AD" },
          500: { value: "#FFCF99" },
          600: { value: "#E8BC8B" },
          700: { value: "#B5936D" },
          800: { value: "#8C7254" },
          900: { value: "#6B5740" },
          950: { value: "#391F00" },
          960: { value: "#F3F0F0" },
        },
        mainBlack: {
          50: { value: "#E9E9E9" },
          100: { value: "#DEDEDE" },
          150: { value: "#21212E" },
          200: { value: "#BBBABA" },
          250: { value: "#B9B8B8" },
          300: { value: "#232222" },
          400: { value: "#201F1F" },
          500: { value: "#1C1B1B" },
          600: { value: "#1A1A1A" },
          700: { value: "#151414" },
          800: { value: "#100F0F" },
          900: { value: "#0C0B0B" },
          950: { value: "#121212" },
        },
        grey: {
          50: { value: "#F5F5F5" },
          100: { value: "#DFDFDF" },
          150: { value: "#E0E0E9" },
          200: { value: "#D0D0D0" },
          300: { value: "#BBBBBB" },
          400: { value: "#ADADAD" },
          500: { value: "#999999" },
          600: { value: "#8B8B8B" },
          700: { value: "#6D6D6D" },
          800: { value: "#545454" },
          900: { value: "#404040" },
          950: { value: "#222224" },
          960: { value: "#B5C1EE" },
        },
        warning: {
          50: { value: "#FFFCEA" },
          100: { value: "#FFF4BD" },
          200: { value: "#FFEF9D" },
          300: { value: "#FFE870" },
          400: { value: "#FFE455" },
          500: { value: "#FFDD2A" },
          600: { value: "#E8C926" },
          700: { value: "#B59D1E" },
          800: { value: "#8C7A17" },
          900: { value: "#6B5D12" },
        },

        error: {
          50: { value: "#FFE6E6" },
          100: { value: "#FFB0B0" },
          200: { value: "#FF8A8A" },
          300: { value: "#FF5454" },
          400: { value: "#FF3333" },
          500: { value: "#FF0000" },
          600: { value: "#E80000" },
          700: { value: "#B50000" },
          800: { value: "#8C0000" },
          900: { value: "#6B0000" },
        },

        foundation: {
          50: { value: "#FFFFFF" },
          100: { value: "#FFFFFF" },
          200: { value: "#FFFFFF" },
          300: { value: "#FFFFFF" },
          400: { value: "#E4E3E3" },
          500: { value: "#FFFFFF" },
          600: { value: "#E8E8E8" },
          700: { value: "#B5B5B5" },
          800: { value: "#8C8C8C" },
          900: { value: "#6B6B6B" },
          950: { value: "#E8E8E9" },
        },
      },
      fonts: {
        body: { value: "system-ui, sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        bd_background: {
          value: {
            base: "{colors.foundation.600}",
            _dark: "{colors.mainBlack.900}",
          },
        },
        border_background: {
          value: {
            base: "{colors.foundation.950}",
            _dark: "{colors.mainBlack.950}",
          },
        },
        badge_background: {
          value: {
            base: "{colors.secondary.100}",
            _dark: "{colors.secondary.950}",
          },
        },
        main_background: {
          value: {
            base: "{colors.foundation.50}",
            _dark: "{colors.mainBlack.700}",
          },
        },
        header_text: {
          value: {
            base: "{colors.foundation.50}",
            _dark: "{colors.foundation.500}",
          },
        },
        icon_color: {
          value: {
            base: "{colors.primary.500}",
            _dark: "{colors.white.500}",
          },
        },
        button_bg: {
          value: {
            base: "{colors.primary.950}",
            _dark: "{colors.foundation.500}",
          },
        },
        button_border: {
          value: {
            base: "{colors.grey.150}",
            _dark: "{colors.mainBlack.150}",
          },
        },
        button_bg_disabled: {
          value: {
            base: "{colors.primary.200}",
            _dark: "{colors.primary.100}",
          },
        },
        text_primary: {
          value: {
            base: "{colors.mainBlack.500}",
            _dark: "{colors.foundation.400}",
          },
        },
        button_text: {
          value: {
            _dark: "{colors.mainBlack.500}",
            base: "{colors.foundation.400}",
          },
        },
        input_border: {
          value: {
            _dark: "{colors.mainBlack.250}",
            base: "{colors.foundation.400}",
          },
        },
        chat_inputbg: {
          value: {
            _dark: "{colors.mainBlack.900}",
            base: "{colors.foundation.600}",
          },
        },

        chat_textbg: {
          value: {
            _dark: "{colors.mainBlack.900}",
            base: "{colors.secondary.960}",
          },
        },
        chat_textbg_inv: {
          value: {
            base: "{colors.primary.950}",
            _dark: "{colors.grey.960}",
          },
        },
        bg_box: {
          value: {
            _dark: "{colors.mainBlack.500}",
            base: "{colors.foundation.50}",
          },
        },
        active_chat: {
          value: {
             base: "{colors.mainBlack.950}",
            _dark: "{colors.grey.960}",
          },
        },


        time_box: {
          value: {
            _dark: "{colors.secondary.500}",
            base: "{colors.secondary.100}",
          },
        },
        consult_hover: {
          value: {
            _dark: "{colors.secondary.950}",
            base: "{colors.secondary.500}",
          },
        },
        time_boxconsult: {
          value: {
            _dark: "{colors.secondary.900}",
            base: "{colors.secondary.100}",
          },
        },

        networking_box: {
          value: {
            base: "{colors.secondary.50}",
            _dark: "{colors.mainBlack.950}",
          },
        },

        bt_schedule: {
          value: {
            _dark: "{colors.primary.200}",
            base: "{colors.primary.600}",
          },
        },

        time_boxcon: {
          value: {
            _dark: "{colors.mainBlack.300}",
            base: "{colors.secondary.100}",
          },
        },

        bt_schedule_hover: {
          value: {
            _dark: "{colors.primary.200}",
            base: "{colors.primary.600}",
          },
        },
        act_text: {
          value: {
            _dark: "{colors.primary.400}",
            base: "{colors.primary.900}",
          },
        },
        act_box: {
          value: {
            _dark: "{colors.gray.400}",
            base: "{colors.gray.100}",
          },
        },
        
        border_but: {
          value: {
            _dark: "{colors.gray.900}",
            base: "{colors.gray.100}",
          },
        },
      },
    },
  },
});

export default system;
