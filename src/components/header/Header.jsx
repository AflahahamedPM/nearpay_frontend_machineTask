import { BarChart3, Menu, Settings, X, ChevronDown } from "lucide-react";
import React from "react";
import { useDashboardData } from "../../providers/DashboardProvider";
import { Button } from "../ui/button";

const Header = () => {
  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    currentPage,
    setCurrentPage,
    setShowSubMenu,
    showSubMenu,
  } = useDashboardData();

  const navDatas = [
    { title: "Dashboard", icon: null },
    {
      title: "Settings",
      icon: <Settings className="w-4 h-4" />,
      subMenu: [{ subtitle: "Categories" }, { subtitle: "Budgets" }],
    },
    { title: "Reports", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const handleNavClick = (navItem) => {
    const haveSubMenus = navDatas.find((data) => data?.title === navItem)
      ?.subMenu;
    if (!haveSubMenus) {
      setCurrentPage(navItem.toLowerCase());
      setMobileMenuOpen(false);
      setShowSubMenu(null);
    } else {
      setShowSubMenu(showSubMenu === navItem ? null : navItem);
    }
  };

  return (
    <nav className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg min-w-screen">
      <div className="mx-auto flex justify-between items-center">
        <h2 className="sm:text-4xl text-xl font-bold flex items-center gap-2">
          Expense Manager
        </h2>

        <Button
          className="md:hidden text-indigo-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="size-4" /> : <Menu />}
        </Button>

        <div
          className={`${
            mobileMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row absolute md:relative top-16 md:top-0 left-0 right-0 md:gap-4 bg-indigo-500 rounded-lg z-30 md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none`}
        >
          {navDatas.map((data, idx) => (
            <div
              key={data.title ?? idx}
              className="flex flex-col items-start w-full md:w-auto"
            >
              <Button
                onClick={() => handleNavClick(data?.title)}
                className={`px-4 py-2 rounded-lg transition-all mb-3 flex items-center gap-2 w-full md:w-auto justify-between 

                    bg-white text-indigo-600
                `}
              >
                <span className="flex items-center gap-2">
                  {data?.icon}
                  {data?.title}
                </span>
                {data?.subMenu && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showSubMenu === data?.title ? "rotate-180" : ""
                    }`}
                  />
                )}
              </Button>

              {showSubMenu === data?.title && Array.isArray(data?.subMenu) && (
                <div className="sm:w-1/2 w-full md:absolute md:top-full md:left-23 md:mt-2 md:bg-white md:shadow-lg md:rounded-lg md:min-w-[200px] flex flex-col p-2">
                  {data.subMenu.map((sub, i) => (
                    <Button
                      key={sub.subtitle ?? i}
                      className={`text-sm text-left mb-1 px-4 py-2 rounded transition-all ${
                        currentPage === sub.subtitle.toLowerCase()
                          ? "bg-indigo-100 text-indigo-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setCurrentPage(sub?.subtitle?.toLowerCase());
                        setMobileMenuOpen(false);
                        setShowSubMenu(null);
                      }}
                    >
                      {sub?.subtitle}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;
