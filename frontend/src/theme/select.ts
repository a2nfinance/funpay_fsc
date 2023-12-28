import { selectAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys)

export const selectTheme = defineMultiStyleConfig({ 
    defaultProps: {
        size: "lg",
    },
    baseStyle: {
        field: {
           //color: "gray.500"
        }
    }

 })