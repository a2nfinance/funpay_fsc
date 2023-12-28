export const sidebarContainerStyle = (colorMode) => {

    return {
        bg: colorMode == "light" ? "blue.900" : "gray.900",
        transition: "3s ease",
        borderRight: 1,
        borderRightColor: colorMode === "light" ? 'gray.200' : 'gray.700',
        w: { base: 'full', md: "250px" },
        pos: "fixed",
        top: "10px",
        bottom: "10px",
        color: colorMode === "light" ? "white" : "white",
        mr: "20px",
        ml: "10px",
        rounded: "20px"
    }

}

export const sidebarWrapperStyle = (colorMode) => {
    return {
        minH: "100vh",
        bg: colorMode === "light" ? "linear-gradient(180deg, rgba(239,246,255,1) 0%, rgba(219,234,254,1) 100%);" : "gray.700"
    }
}
export const navItemLinkStyle = (colorMode) => {
    return {
        textDecoration: "none",
        _focus: { boxShadow: "none" },
        width: "full",
        _hover: {
            textDecoration: "none"
        }
    }
}
export const navItemFlexStyle = (colorMode) => {
    return {
        transition: "0.5s ease",
        alignItems: "center",
        align: "center",
        py: 1,
        ml: 4,
        mt: 5,
        mb: 5,
        role: "group",
        // cursor: "pointer",
        w: "full",
        color: colorMode == "light" ? "gray.200" : "gray.600",
        _hover: {
            //borderLeft: "3px solid white",
            color: "white",
            //px: 3
        }
    }
}

export const navItemContentStyle= (colorMode) => {
    return {
        fontWeight: 600,
        fontSize: 16,
        letterSpacing: 1
    }
}

export const navItemIconStyle = (colorMode) => {
    return {
        mr: 4,
        fontSize: 22,
        opacity: 0.7,
        _groupHover: {
            color: 'white',
        }
    }
}