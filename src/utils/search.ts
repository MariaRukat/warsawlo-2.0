import {
  arrayDeserializer,
  arraySerializer,
  basicDeserializer,
  basicSerializer,
  pageNumberDeserializer,
  pageNumberSerializer,
  ParamsModeType,
} from './searchSerializers';
import { FilterDefinition } from '../data/filters';
import { FiltersState } from './filters';

const serializerDeserializerOverwrites: Record<string, any> = {
  page: [pageNumberSerializer, pageNumberDeserializer],
  schoolType: [arraySerializer, arrayDeserializer],
  extendedSubjects: [arraySerializer, arrayDeserializer],
  district: [arraySerializer, arrayDeserializer],
  public: [arraySerializer, arrayDeserializer],
};

const apiParamKeysOverwrites: Record<string, string> = {
  public: 'is_public',
  schoolType: 'school_type',
  extendedSubjects: 'highschoolclass__extendedsubject__name',
  district: 'address__district',
  query: 'school_name',
};

export const apiDefaultParams: Record<string, string> = {
  school_type: 'liceum ogólnokształcące|technikum|szkoła branżowa I stopnia',
  ordering: 'school_name',
};

export const serializeSearchData = (
  searchData: Record<string, any>,
  mode: ParamsModeType,
): string => {
  const searchParams = new URLSearchParams();

  if (mode === 'api') {
    Object.entries(apiDefaultParams).forEach((entry) => searchParams.set(...entry));
  }

  return Object.entries(searchData)
    .reduce((p, [_key, value]) => {
      let key = _key;
      let serializer = basicSerializer;

      if (Object.prototype.hasOwnProperty.call(serializerDeserializerOverwrites, key)) {
        [serializer] = serializerDeserializerOverwrites[key];
      }

      if (mode === 'api' && Object.prototype.hasOwnProperty.call(apiParamKeysOverwrites, key)) {
        key = apiParamKeysOverwrites[key] as string;
      }

      return serializer([key, value], p, mode);
    }, searchParams)
    .toString();
};

export const deserializeSingleSearchData = (key: string, p: URLSearchParams): any => {
  let deserializer = basicDeserializer;

  if (Object.prototype.hasOwnProperty.call(serializerDeserializerOverwrites, key)) {
    [, deserializer] = serializerDeserializerOverwrites[key];
  }
  return deserializer(key, p);
};

export const deserializeQuery = (p: URLSearchParams): any =>
  deserializeSingleSearchData('query', p) ?? '';

export const deserializePage = (p: URLSearchParams): any =>
  deserializeSingleSearchData('page', p) ?? 1;

export const deserializeFilters = (
  p: URLSearchParams,
  filtersDefinition: FilterDefinition[],
): FiltersState => {
  const filtersState = new Map();
  filtersDefinition.forEach((filterDef) => {
    const value = deserializeSingleSearchData(filterDef.key, p);
    const possibleValues = filterDef.choices.map((choice) => choice.id);
    if (value && value.every((v: string) => possibleValues.includes(v)))
      filtersState.set(filterDef.key, new Set(value));
  });

  return filtersState;
};
