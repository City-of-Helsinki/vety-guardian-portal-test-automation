// Texts of the selected answers on the summary (step 8). Language and care
// options are still translation keys, so update these when the texts are added.
export const summaryTexts = {
  language: {
    fi: 'language.fi',
    sv: 'language.sv',
  },
  // Step 4
  careType: {
    daytimeCare: 'taydentava.options.paivaaikainen_varhaiskasvatus',
    dayAndEveningCare: 'taydentava.options.paiva_ja_ilta_aikainen_varhaiskasvatus_arkisin',
    roundTheClockCare: 'taydentava.options.ymparivuorokautinen_varhaiskasvatus',
  },
  // Step 5, keys match PreschoolEnrollmentPage.step5.daytimeCare
  careExtent: {
    careExtentMax1Hour: 'taydentava.options.esiopetus_4h_1h_vaka',
    careExtent1to3Hours: 'taydentava.options.esiopetus_4h_1_3h_vaka',
    careExtent3to4Hours: 'taydentava.options.esiopetus_4h_3_4h_vaka',
    careExtent4to6Hours: 'taydentava.options.esiopetus_4h_4_6h_vaka',
  },
  // Step 6, same as the checkbox labels
  specialSupport: 'Lapsella on erityisen tuen tarve',
  medicationNeed: 'Lapsella on todettu vaativan lääkehoidon tarve',
  noSupport: 'Ei tuen tai lääkehoidon tarvetta',
};
