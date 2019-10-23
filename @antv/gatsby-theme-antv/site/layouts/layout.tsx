import React, { useEffect } from 'react';
import { useStaticQuery, graphql, withPrefix } from 'gatsby';
import Footer from 'rc-footer';
import { getCurrentLangKey } from 'ptz-i18n';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import Header from '../components/header';
import locale from '../locale.json';
import footerColumns from '../components/footerColumns';
import styles from './layout.module.less';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: locale,
  });

interface LayoutProps {
  children: React.ReactElement<any>;
  location: Location;
}

const Layout: React.FC<LayoutProps> = ({ children, location }) => {
  const { i18n } = useTranslation();
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          docs {
            slug
            title {
              zh
              en
            }
            order
            redirect
          }
        }
        pathPrefix
      }
    }
  `);

  const {
    site: {
      siteMetadata: { title, docs },
      pathPrefix,
    },
  } = data;
  const path = location.pathname.replace(pathPrefix, '');
  const currentLangKey = getCurrentLangKey(['zh', 'en'], 'zh', path);

  i18n.init({
    lng: currentLangKey,
    fallbackLng: 'zh',
  });

  useEffect(() => {
    if (i18n.language !== currentLangKey) {
      i18n.changeLanguage(currentLangKey);
    }
  }, [currentLangKey]);

  if (path === withPrefix('/') || `${path}/` === withPrefix('/')) {
    return children;
  }

  return (
    <>
      <Header
        siteTitle={title}
        path={path}
        pathPrefix={pathPrefix}
        docs={docs}
      />
      <main className={styles.main}>{children}</main>
      <Footer
        columns={footerColumns}
        bottom={
          <div>
            © {new Date().getFullYear()}, Built with
            {` `}
            <a href="https://xtech.antfin.com/">AFX</a>
          </div>
        }
      />
    </>
  );
};

export default Layout;