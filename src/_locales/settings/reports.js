import { medalColors } from '../../models';

const gds_reports = {
  general: [
    { code: 'N11', title: 'Medals by NOC' },
    { code: 'N13', title: 'Placing by NOC' },
    { code: 'N15', title: 'Multi-Medallists' },
    { code: 'N17', title: 'Result in Last Olympic Cycle' },
    { code: 'N18', title: 'World Records/Achievements' },
    { code: 'N20', title: 'Athletes Biographies' },
    { code: 'N22', title: 'Team Profiles' },
    { code: 'N24', title: 'NOC Profile' },
    { code: 'N62', title: 'Head to Heads' },
  ],
  summer: [{ code: 'N23', title: 'Officials/Horses Biographies' }],
  winter: [{ code: 'N23', title: 'Officials Biographies' }],
};
export default gds_reports;

export const medalColorsArray = Object.values(medalColors);
