
import React, {
  useState,
  useMemo,
  useCallback,
} from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SectionList,
  RefreshControl,
  Pressable,
  useWindowDimensions,
  Platform,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import type {
  StudySpace,
  FilterType,
} from "../types";

import SpaceCard from "../components/SpaceCard";
import FilterChip from "../components/FilterChip";

// ========================================
// TYPES
// ========================================

type ExploreScreenProps = {
  spaces: StudySpace[];
  favorites: string[];
  onToggleFavorite: (spaceId: string) => void;
  onOpenSpace: (spaceId: string) => void;
};

type SpaceSection = {
  title: string;
  data: StudySpace[][];
};

// ========================================
// FILTER OPTIONS
// ========================================

const FILTERS: FilterType[] = [
  "All",
  "Quiet",
  "Group",
  "Open now",
];

// ========================================
// EXPLORE SCREEN
// ========================================

export default function ExploreScreen({
  spaces,
  favorites,
  onToggleFavorite,
  onOpenSpace,
}: ExploreScreenProps) {

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("All");

  const [refreshing, setRefreshing] = useState(false);

  const [lastRefreshed, setLastRefreshed] =
    useState(new Date());

  const { width } = useWindowDimensions();

  // One column on small screens.
  // Two columns on screens 600px or wider.
  const numColumns = width >= 600 ? 2 : 1;

  // ========================================
  // CHECK AVAILABLE SLOTS
  // ========================================

  const hasAvailableSlot = useCallback(
    (space: StudySpace) => {
      return (
        space.occupied < space.seats &&
        space.slots.some(
          (slot) => !space.bookedSlots.includes(slot)
        )
      );
    },
    []
  );

  // ========================================
  // SEARCH AND FILTER
  // ========================================

  const filteredSpaces = useMemo(() => {

    return spaces.filter((space) => {

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        space.name.toLowerCase().includes(searchText) ||
        space.building.toLowerCase().includes(searchText) ||
        space.floor.toLowerCase().includes(searchText);

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Quiet" &&
          space.type === "Quiet") ||
        (activeFilter === "Group" &&
          space.type === "Group") ||
        (activeFilter === "Open now" &&
          hasAvailableSlot(space));

      return matchesSearch && matchesFilter;
    });

  }, [spaces, search, activeFilter, hasAvailableSlot]);

  // ========================================
  // BEST MATCH RIGHT NOW
  // ========================================

  const bestMatch = useMemo(() => {

    const candidates = filteredSpaces.filter(
      (space) =>
        space.type === "Quiet" &&
        hasAvailableSlot(space)
    );

    return [...candidates].sort(
      (a, b) =>
        a.occupied / a.seats -
        b.occupied / b.seats
    )[0];

  }, [filteredSpaces, hasAvailableSlot]);

  // ========================================
  // GROUP SPACES BY BUILDING
  // ========================================

  const sections = useMemo<SpaceSection[]>(() => {

    const buildings = Array.from(
      new Set(filteredSpaces.map((space) => space.building))
    );

    return buildings.map((building) => {

      const buildingSpaces = filteredSpaces.filter(
        (space) => space.building === building
      );

      const rows: StudySpace[][] = [];

      for (
        let index = 0;
        index < buildingSpaces.length;
        index += numColumns
      ) {
        rows.push(
          buildingSpaces.slice(index, index + numColumns)
        );
      }

      return {
        title: building,
        data: rows,
      };
    });

  }, [filteredSpaces, numColumns]);

  // ========================================
  // REFRESH WHEN EXPLORE SCREEN IS OPENED
  // ========================================

  useFocusEffect(
    useCallback(() => {
      setLastRefreshed(new Date());
    }, [])
  );

  // ========================================
  // PULL TO REFRESH
  // ========================================

  const handleRefresh = useCallback(() => {

    if (refreshing) return;

    setRefreshing(true);

    setTimeout(() => {
      setLastRefreshed(new Date());
      setRefreshing(false);
    }, 800);

  }, [refreshing]);

  // ========================================
  // SCREEN UI
  // ========================================

  return (
    <View style={styles.container}>

      {/* SEARCH BAR */}

      <View style={styles.searchContainer}>

        <Text style={styles.searchIcon}>
          ⌕
        </Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search spaces or buildings..."
          placeholderTextColor="#9999A8"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />

      </View>

      {/* FILTER CHIPS */}

      <View style={styles.filterContainer}>

        {FILTERS.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            selected={activeFilter === filter}
            onPress={() => setActiveFilter(filter)}
          />
        ))}

      </View>

      {/* BEST MATCH BANNER */}

      {bestMatch ? (

        <Pressable
          style={styles.bestMatch}
          onPress={() => onOpenSpace(bestMatch.id)}
        >

          <View style={styles.bestMatchHeader}>

            <Text style={styles.bestMatchTitle}>
              ✨ Best Match Right Now
            </Text>

            <Text style={styles.bestMatchArrow}>
              →
            </Text>

          </View>

          <Text style={styles.bestMatchName}>
            {bestMatch.name}
          </Text>

          <Text style={styles.bestMatchDetails}>
            {bestMatch.building} · {bestMatch.floor}
          </Text>

          <Text style={styles.bestMatchHint}>
            Lowest-occupancy quiet space with an available slot.
            Tap to view details.
          </Text>

        </Pressable>

      ) : (

        <View style={styles.noMatch}>

          <Text style={styles.noMatchText}>
            No Best Match available for your current search or filter.
          </Text>

        </View>

      )}

      {/* SECTION LIST */}

      <SectionList
        sections={sections}
        keyExtractor={(row) =>
          row.map((space) => space.id).join("-")
        }

        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>
            {section.title.toUpperCase()}
          </Text>
        )}

        renderItem={({ item }) => (

          <View style={styles.cardRow}>

            {item.map((space) => (

              <View
                key={space.id}
                style={styles.cardWrapper}
              >

                <SpaceCard
                  space={space}
                  isFavorite={favorites.includes(space.id)}
                  onPress={() => onOpenSpace(space.id)}
                  onToggleFavorite={() =>
                    onToggleFavorite(space.id)
                  }
                />

              </View>

            ))}

            {numColumns === 2 && item.length === 1 ? (
              <View style={styles.cardWrapper} />
            ) : null}

          </View>

        )}

        stickySectionHeadersEnabled={false}

        contentContainerStyle={styles.listContent}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1A1751"
            colors={["#1A1751"]}
          />
        }

        ListEmptyComponent={

          <View style={styles.emptyContainer}>

            <Text style={styles.emptyTitle}>
              No spaces found
            </Text>

            <Text style={styles.emptyText}>
              No spaces match your search.
              Try another keyword or filter.
            </Text>

          </View>

        }
      />

      {/* LAST REFRESHED */}

      <Text style={styles.lastRefreshed}>
        Last refreshed: {lastRefreshed.toLocaleTimeString()}
      </Text>

    </View>
  );
}

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7F7FB",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 14,
    marginTop: 12,
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 1,
    borderColor: "#E5E5ED",
  },

  searchIcon: {
    fontSize: 23,
    color: "#77778A",
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#222222",
  },

  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  bestMatch: {
    backgroundColor: "#FFF3D6",
    marginHorizontal: 14,
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F2D99D",

    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },

      android: {
        elevation: 3,
      },
    }),
  },

  bestMatchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bestMatchTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#75500C",
  },

  bestMatchArrow: {
    fontSize: 18,
    color: "#75500C",
  },

  bestMatchName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1A1751",
    marginTop: 8,
  },

  bestMatchDetails: {
    fontSize: 11,
    color: "#77778A",
    marginTop: 4,
  },

  bestMatchHint: {
    fontSize: 11,
    color: "#75500C",
    marginTop: 7,
  },

  noMatch: {
    backgroundColor: "#FFF3D6",
    padding: 12,
    marginHorizontal: 14,
    marginBottom: 12,
    borderRadius: 10,
  },

  noMatchText: {
    color: "#75500C",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#77778A",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    letterSpacing: 0.8,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  cardWrapper: {
    flex: 1,
    minWidth: 0,
  },

  listContent: {
    paddingBottom: 12,
    flexGrow: 1,
  },

  emptyContainer: {
    padding: 30,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1A1751",
  },

  emptyText: {
    fontSize: 12,
    color: "#77778A",
    textAlign: "center",
    marginTop: 8,
  },

  lastRefreshed: {
    fontSize: 10,
    color: "#9999A8",
    textAlign: "center",
    paddingVertical: 7,
    backgroundColor: "#FFFFFF",
  },

});
