interface Items extends Record<string, any> {
  createdAt: string;
}

export const gen_options = (min_years: number, max_years: number) => {
  const options = Array(max_years - min_years == 0 ? 1 : max_years - min_years)
    .fill(null)
    .map((_, idx) => min_years + idx);
  return options.reverse();
};

export const paginate = (items: Items[], curr_year: number) => {
  return items.filter((i) => new Date(i.createdAt).getFullYear() == curr_year);
};
