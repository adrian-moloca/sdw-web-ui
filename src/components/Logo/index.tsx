import logo from 'assets/images/logo.svg';
import { t } from 'i18next';
const LogoMain = () => {
  return <img src={logo} alt={t('main.project.name')} style={{ height: 40 }} />;
};

export default LogoMain;
