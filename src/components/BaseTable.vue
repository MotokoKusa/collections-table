<template>
  <div>
    <div class="form">
      <div class="form__input" v-for="(elem, idx) in formInputs" :key="idx">
        <input
          :type="elem !== 'dates' ? 'text' : 'date'"
          :name="elem"
          v-model.trim="form[elem]"
        />
        <button
          @click.prevent="addCollection(elem)"
          :name="elem"
          :disabled="!form[elem]"
        >
          Добавить
        </button>
      </div>
    </div>
    <div class="collections">
      <div
        class="collections__wrap"
        v-for="(collection, key) in collections"
        :key="key"
      >
        <div
          class="collections__item"
          v-for="item in collection"
          :key="item.id"
        >
          <template v-if="key === 'events'">
            <div class="collections__item__text">
              <b>uid:</b> {{ item.id }} <b>название:</b>
              {{ getValueById("dates", item.dateId).value }}
              {{ getValueById("tasks", item.taskId).value }}
              {{ getValueById("statuses", item.statusId).value }}
            </div>
            <button
              @click.prevent="deleteCollection(key, item.id)"
              class="collections__item__button"
            >
              Удалить
            </button>
          </template>
          <template v-else>
            <div class="collections__item__text">
              <b>uid:</b> {{ item.id }} <b>название:</b> {{ item.value }}
            </div>
            <button
              @click.prevent="deleteCollection(key, item.id)"
              class="collections__item__button"
            >
              Удалить
            </button>
          </template>
        </div>
      </div>
    </div>
    <table v-if="!isEmptyCollections" class="table">
      <thead>
        <tr>
          <th>Задачи / Даты</th>
          <th v-for="el in collections.dates" :key="el.id">
            {{ el.value }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in collections.tasks" :key="task.id">
          <td><input name="tableTask" type="text" v-model="task.value" /></td>

          <td v-for="date in collections.dates" :key="date.id">
            <button
              v-if="collections.statuses.length && !findEvent({ date, task })"
              @click.prevent="
                addEvent({
                  taskId: task.id,
                  dateId: date.id,
                  statusId: collections.statuses[0].id,
                })
              "
            >
              Добавить
            </button>
            <select
              v-if="findEvent({ date, task })"
              @change="changeEvent($event, { date, task })"
            >
              <option
                v-for="status in collections.statuses"
                :key="status.id"
                :value="status.id"
              >
                {{ status.value }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed, reactive, ref } from "vue";
import { uid } from "uid";

export default {
  name: "BaseTable",

  setup() {
    const collections = reactive({
      tasks: [
        { id: "9e74", value: "Задача 1" },
        { id: "e745", value: "Задача 2" },
        { id: "7453", value: "Задача 3" },
      ],
      dates: [
        { id: "4530", value: "2023-04-27" },
        { id: "530b", value: "2023-04-28" },
        { id: "30bc", value: "2023-04-29" },
      ],
      statuses: [
        { id: "0bc8", value: "Статус 1" },
        { id: "bc81", value: "Статус 2" },
        { id: "c81b", value: "Статус 3" },
      ],
      events: [],
    });

    const isOpenedModal = ref(false);
    const currentTask = ref("");
    const currentDate = ref("");
    const currentStatus = ref("");
    const form = reactive({});
    const formInputs = computed(() => ["tasks", "dates", "statuses"]);
    const isEmptyCollections = computed(() => {
      return !collections.tasks.length && !collections.dates.length;
    });

    const addCollection = (key) => {
      collections[key].push({
        id: uid(4),
        value: form[key],
      });
      form[key] = null;
    };

    const addEvent = (obj) => {
      collections.events.push({
        id: uid(4),
        dateId: obj.dateId,
        taskId: obj.taskId,
        statusId: obj.statusId,
      });
    };

    const changeEvent = (val, obj) => {
      const event = findEvent(obj);
      event.statusId = val.target.value;
    };

    const getValueById = (collection, id) => {
      return collections[collection].find((el) => el.id === id) || "";
    };

    const deleteCollection = (key, id) => {
      if (key !== "events") {
        const event = collections.events.find(
          (el) => el.taskId === id || el.dateId === id || el.statusId
        );
        collections.events = collections.events.filter(
          (el) => el.id !== event.id
        );
      }
      collections[key] = collections[key].filter((el) => el.id !== id);
    };

    const findEvent = (obj) => {
      return collections.events.find(
        (el) => el.dateId === obj.date.id && el.taskId === obj.task.id
      );
    };

    return {
      currentTask,
      currentDate,
      currentStatus,
      addCollection,
      deleteCollection,
      isOpenedModal,
      collections,
      form,
      formInputs,
      addEvent,
      findEvent,
      changeEvent,
      getValueById,
      isEmptyCollections,
    };
  },
};
</script>
