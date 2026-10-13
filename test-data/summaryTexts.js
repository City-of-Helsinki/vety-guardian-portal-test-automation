// Texts of the selected answers on the summary (step 8). Language and care
// options are still translation keys, so update these when the texts are added.
export const summaryTexts = {
  language: {
    fi: 'language.fi',
    sv: 'language.sv',
  },
  // Step 4
  careType: {
    daytimeCare: 'vakaOptions.paivaaikainen_varhaiskasvatus',
    shiftCare: 'vakaOptions.vuorohoito_varhaiskasvatus',
  },
  // Step 5, keys match PreschoolEnrollmentPage.step5.daytimeCare and .shiftCare
  careExtent: {
    careExtentMax1Hour: 'vakaOptions.esiopetus_4h_1h_vaka',
    careExtent1to3Hours: 'vakaOptions.esiopetus_4h_1_3h_vaka',
    careExtent3to4Hours: 'vakaOptions.esiopetus_4h_3_4h_vaka',
    careExtent4to6Hours: 'vakaOptions.esiopetus_4h_4_6h_vaka',
    careExtent61to100Hours: 'vakaOptions.esiopetus_4h_61_100h_vuoroh',
    careExtent101to160Hours: 'vakaOptions.esiopetus_4h_101_160h_vuoroh',
    careExtentOver160Hours: 'vakaOptions.esiopetus_4h_160h_vuoroh',
  },
  // Shown instead of a value when the answer is empty
  empty: '–',
  // Step 6, same as the checkbox labels
  specialSupport: 'Lapsella on erityisen tuen tarve',
  medicationNeed: 'Lapsella on todettu vaativan lääkehoidon tarve',
  noSupport: 'Ei tuen tai lääkehoidon tarvetta',
};
