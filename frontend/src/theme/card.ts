import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys)
  
// @ts-ignore  
export const cardTheme = defineMultiStyleConfig({
  sizes: {
    md: {
      container: {
        borderRadius: 20,
        mb: 5
      }
    }
  },
  baseStyle: {
    header: {
      fontSize: 16,
      fontWeight: 500,
      textTransform: "uppercase",
      bg: "wheat",
      borderRadius: "20px 20px 0 0",
      _dark: {
        bg: "gray.900"
      }
    },
    container: {
      w: "full",
      _dark: {
        bg: "gray.800"
      }
    }
  },
})