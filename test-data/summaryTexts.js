// Texts of the selected answers on the summary (step 8). They are the same as
// the option labels on the form steps.
export const summaryTexts = {
  language: {
    fi: 'Suomi',
    sv: 'Ruotsi',
  },
  // Step 4
  careType: {
    daytimeCare: 'Esiopetus 4 tuntia jonka lisäksi päiväaikainen varhaiskasvatus',
    shiftCare: 'Esiopetus 4 tuntia arkisin, jonka lisäksi vuorohoidon tarve varhaiskasvatuksessa',
  },
  // Step 5, keys match PreschoolEnrollmentPage.step5.daytimeCare and .shiftCare
  careExtent: {
    careExtentMax1Hour: 'Esiopetus ja varhaiskasvatus yhteensä 5 tuntia',
    careExtent1to3Hours: 'Esiopetus ja varhaiskasvatus yhteensä enintään 5–7 tuntia',
    careExtent3to4Hours: 'Esiopetus ja varhaiskasvatus yhteensä enintään 7-8 tuntia',
    careExtent4to6Hours: 'Esiopetus ja varhaiskasvatus yhteensä enintään 8-10 tuntia',
    careExtent61to100Hours: 'Esiopetus 4 tuntia, jonka lisäksi 61-100 tuntia täydentävää varhaiskasvatusta vuorohoidossa.',
    careExtent101to160Hours: 'Esiopetus 4 tuntia, jonka lisäksi 101-160 tuntia täydentävää varhaiskasvatusta vuorohoidossa.',
    careExtentOver160Hours: 'Esiopetus 4 tuntia, jonka lisäksi yli 160 tuntia täydentävää varhaiskasvatusta vuorohoidossa.',
  },
  // Shown instead of a value when the answer is empty
  empty: '–',
  // Step 6, same as the checkbox labels
  specialSupport: 'Lapsella on tuen tarve',
  medicationNeed: 'Lapsella on todettu vaativan lääkehoidon tarve',
  noSupport: 'Ei tuen tai lääkehoidon tarvetta',
};
