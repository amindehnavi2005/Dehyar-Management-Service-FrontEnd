// Next Imports
import { useParams } from "next/navigation";

// MUI Imports
import { useTheme } from "@mui/material/styles";

// Third-party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// Component Imports
import { Menu, MenuItem } from "@menu/vertical-menu";

// import { GenerateVerticalMenu } from '@components/GenerateMenu'
// Hook Imports
import { useSettings } from "@core/hooks/useSettings";
import useVerticalNav from "@menu/hooks/useVerticalNav";

// Styled Component Imports
import StyledVerticalNavExpandIcon from "@menu/styles/vertical/StyledVerticalNavExpandIcon";

// Style Imports
import menuItemStyles from "@core/styles/vertical/menuItemStyles";
import menuSectionStyles from "@core/styles/vertical/menuSectionStyles";
import { useAuth } from "@/contexts/AuthContext";
import accessControl from "@components/layout/vertical/accessControl";
import Loading from "@/@core/components/loading/Loading";

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon
    open={open}
    transitionDuration={transitionDuration}
  >
    <i className="ri-arrow-right-s-line" />
  </StyledVerticalNavExpandIcon>
);

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme();
  const verticalNavOptions = useVerticalNav();
  const { settings } = useSettings();
  const params = useParams();
  const { isBreakpointReached } = useVerticalNav();
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  const { transitionDuration } = verticalNavOptions;
  const { lang: locale, id } = params;
  const ScrollWrapper = isBreakpointReached ? "div" : PerfectScrollbar;

  const renderMenuItems = () => {
    if (!user || !user.work_group) {
      return (
        <MenuItem>
          <span>Unauthorized</span>
        </MenuItem>
      );
    }

    // Convert work_group to string if accessControl keys are strings
    const workGroupKey = user.work_group;
    const menuItems = accessControl[workGroupKey] || [];

    if (menuItems.length === 0) {
      return (
        <MenuItem>
          <span>No Access</span>
        </MenuItem>
      );
    }

    // Filter out items where showOnSidebar is false
    const filteredItems = menuItems.filter(
      (item) => item.showOnSidebar !== false
    );

    if (filteredItems.length === 0) {
      return (
        <MenuItem>
          <span>No visible items</span>
        </MenuItem>
      );
    }

    console.log(
      "Current badge values:",
      filteredItems.map((item) => item.badge)
    );

    return filteredItems.map((item) => (
      <MenuItem
        icon={item.icon}
        key={item.href}
        href={item.href}
        badge={item.badge >= "0" ? item.badge : null}
      >
        {item.label}
      </MenuItem>
    ));
  };

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: "bs-full overflow-y-auto overflow-x-hidden",
            onScroll: (container) => scrollMenu(container, false),
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: (container) => scrollMenu(container, true),
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon
            open={open}
            transitionDuration={transitionDuration}
          />
        )}
        renderExpandedMenuItemIcon={{ icon: <i className="ri-circle-fill" /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {renderMenuItems()}
      </Menu>
    </ScrollWrapper>
  );
};

export default VerticalMenu;
