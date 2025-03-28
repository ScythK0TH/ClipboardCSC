const { SortedLinkedList, Node } = require('../models/SortedLinkedList');

describe('SortedLinkedList Tests', () => {
  let list;

  beforeEach(() => {
    list = new SortedLinkedList();
  });

  test('1. Should insert a node into an empty list', () => {
    const data = { title: 'Hello', username: 'Anonymous', description: 'Hello' };
    list.insert(data);
    expect(list.toArray()).toEqual([data]);
  });
  
  test('2. Should insert a node at the beginning of the list', () => {
    const data1 = { title: 'Zebra', username: 'Anonymous', description: 'Hello' };
    const data2 = { title: 'Apple', username: 'Anonymous', description: 'Hello' }; // Should come before data1
    list.insert(data1);
    list.insert(data2);
    expect(list.toArray()).toEqual([data2, data1]);
  });
  
  test('3. Should insert a node in the middle of the list', () => {
    const data1 = { title: 'Apple', username: 'Anonymous', description: 'Hello' };
    const data2 = { title: 'Zebra', username: 'Anonymous', description: 'Test' };
    const data3 = { title: 'Mango', username: 'Anonymous', description: 'Hello' }; // Should go between data1 and data2
    list.insert(data1);
    list.insert(data2);
    list.insert(data3);
    expect(list.toArray()).toEqual([data1, data3, data2]);
  });

  test('4. Should insert a node at the end of the list', () => {
    const data1 = { title: 'Apple', username: 'Anonymous', description: 'Hello' };
    const data2 = { title: 'Zebra', username: 'Anonymous', description: 'Hello' };
    list.insert(data1);
    list.insert(data2);
    expect(list.toArray()).toEqual([data1, data2]);
  });

  test('5. Should remove the first node', () => {
    const data1 = { ID: 1079, username: 'Anonymous', title: 'Hello', description: 'Hello' };
    const data2 = { ID: 2131, username: 'Anonymous', title: 'Hello', description: 'Hello' };
    list.insert(data1);
    list.insert(data2);
    list.removeFirst();
    expect(list.toArray()).toEqual([data2]);
  });

  test('6. Should handle removing the first node from an empty list', () => {
    list.removeFirst();
    expect(list.toArray()).toEqual([]);
  });

  test('7. Should remove the last node', () => {
    const data1 = { ID: 1079, username: 'Anonymous', title: 'Hello', description: 'Hello' };
    const data2 = { ID: 2131, username: 'Anonymous', title: 'Hello', description: 'Hello' };
    list.insert(data1);
    list.insert(data2);
    list.removeLast();
    expect(list.toArray()).toEqual([data1]);
  });

  test('8. Should handle removing the last node from an empty list', () => {
    list.removeLast();
    expect(list.toArray()).toEqual([]);
  });

  test('9. Should remove a node by condition (match found)', () => {
    const data1 = { ID: 1079, username: 'Anonymous', title: 'Hello', description: 'Hello' };
    const data2 = { ID: 2131, username: 'Anonymous', title: 'Hello', description: 'Hello' };
    list.insert(data1);
    list.insert(data2);
    list.removeByCondition((node) => node.ID === 1079);
    expect(list.toArray()).toEqual([data2]);
  });

  test('10. Should handle removing a node by condition (no match found)', () => {
    const data1 = { ID: 1079, username: 'Anonymous', title: 'Hello', description: 'Hello' };
    list.insert(data1);
    list.removeByCondition((node) => node.ID === 9999);
    expect(list.toArray()).toEqual([data1]);
  });

  test('11. Should handle removing a node by condition from an empty list', () => {
    list.removeByCondition((node) => node.ID === 1079);
    expect(list.toArray()).toEqual([]);
  });

  test('12. Should convert the list to an array', () => {
    const data1 = { ID: 1079, username: 'Anonymous', title: 'Hello', description: 'Hello' };
    const data2 = { ID: 2131, username: 'Anonymous', title: 'Hello', description: 'Hello' };
    list.insert(data1);
    list.insert(data2);
    expect(list.toArray()).toEqual([data1, data2]);
  });

  test('13. Should handle converting an empty list to an array', () => {
    expect(list.toArray()).toEqual([]);
  });

  test('14. Should insert nodes with a custom sort key (username)', () => {
    const data1 = { title: 'Zebra', username: 'zebra' };
    const data2 = { title: 'Apple', username: 'apple' }; // Should come before data1
    list.insert(data1);
    list.insert(data2);
    expect(list.toArray()).toEqual([data2, data1]);
  });
  
  test('15. Should insert nodes with a custom sort key (title)', () => {
    const data1 = { title: 'Zebra', username: 'Anonymous' };
    const data2 = { title: 'Apple', username: 'Anonymous' }; // Should come before data1
    list.insert(data1);
    list.insert(data2);
    expect(list.toArray()).toEqual([data2, data1]);
  });
  
  test('16. Should handle inserting nodes with mixed sort keys', () => {
    const data1 = { title: 'Zebra', username: 'zebra' };
    const data2 = { title: 'Apple', username: 'apple' }; // Should come before data1 based on title
    list.insert(data1);
    list.insert(data2);
    expect(list.toArray()).toEqual([data2, data1]);
  });

  test('17. Should handle removing the last node from a list with one node', () => {
    const data = { ID: 1079, username: 'Anonymous', title: 'Hello', description: 'Hello' };
    list.insert(data);
    list.removeLast();
    expect(list.toArray()).toEqual([]);
  });

  test('18. Should handle inserting a node with no sort key', () => {
    const data1 = { ID: 2 }; // No username, should sort by ID
    const data2 = { ID: 1 }; // No username, should come before data1
    list.insert(data1);
    list.insert(data2);
    expect(list.toArray()).toEqual([data1, data2]);
  });

  test('19. Should handle inserting a node with missing sort key', () => {
    const data1 = { ID: 2 }; // No username, should sort by ID
    const data2 = { username: 'apple' }; // No ID, should sort by username
    list.insert(data1);
    list.insert(data2);
    expect(list.toArray()).toEqual([data1, data2]); // Sorted by username first, then ID
  });

  test('20. Should handle removing the last node when there is only one node', () => {
    const data = { ID: 1, username: 'single' };
    list.insert(data);
    list.removeLast();
    expect(list.toArray()).toEqual([]); // List should be empty
  });

  test('21. Should maintain sorted order after multiple insertions and deletions', () => {
    const data1 = { ID: 3, username: 'charlie' };
    const data2 = { ID: 1, username: 'alpha' };
    const data3 = { ID: 2, username: 'bravo' };
    list.insert(data1);
    list.insert(data2);
    list.insert(data3);
    list.removeByCondition((node) => node.ID === 3); // Remove 'charlie'
    expect(list.toArray()).toEqual([data2, data3]); // List should remain sorted
  });

  test('22. Should create a Node with correct data and next as null', () => {
    const node = new Node({ ID: 1, username: 'test' });
    expect(node.data).toEqual({ ID: 1, username: 'test' });
    expect(node.next).toBeNull();
  });
  
  test('23. Should handle calling removeLast on an empty list', () => {
    list.removeLast();
    expect(list.toArray()).toEqual([]); // List should remain empty
  });

  test('24. Should remove the last node when the list has multiple nodes', () => {
    const data1 = { ID: 1, username: 'user1' };
    const data2 = { ID: 2, username: 'user2' };
    const data3 = { ID: 3, username: 'user3' };
  
    list.insert(data1);
    list.insert(data2);
    list.insert(data3);
  
    list.removeLast(); // Remove the last node (user3)
    expect(list.toArray()).toEqual([data1, data2]); // Remaining nodes should be user1 and user2
  });
});