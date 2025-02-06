import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSettings, FiPlusSquare, FiList, FiInbox } from 'react-icons/fi';
import styles from './SideNav.module.css';

const SideNav = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      name: 'General',
      path: '/general',
      icon: <FiSettings className={styles.icon} />
    },
    {
      name: 'Create Trip',
      path: '/create-trip',
      icon: <FiPlusSquare className={styles.icon} />
    },
    {
      name: 'Manage Trips',
      path: '/manage-trips',
      icon: <FiList className={styles.icon} />
    },
    {
      name: 'Requests',
      path: '/requests',
      icon: <FiInbox className={styles.icon} />
    }
  ];

  return (
    <nav className={styles.sidenav}>
      <div className={styles.logoContainer}>
        <h2 className={styles.logo}>Trip Manager</h2>
      </div>

      <div className={styles.menu}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.menuItem} ${
              location.pathname === item.path ? styles.active : ''
            }`}
          >
            {item.icon}
            <span className={styles.menuText}>{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default SideNav;