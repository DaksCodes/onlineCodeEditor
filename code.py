#include<iostream>
#include<vector>
using namespace std;
struct Node{
    public:
    int data;
    Node* next;
    public:
    Node(int data1, Node* next1)
    {
        data=data1;
        next=next1;
    }
};
Node* convertarraytoLL(vector<int>& arr)
{
    Node* head= new Node(arr[0], nullptr);
    Node* mover=head;
    for(int i=1;i<arr.size();i++)
    {
        Node* temp= new Node(arr[i], nullptr);
        mover->next=temp;
        mover=mover->next;
    }
    return head;
}
int lengthLL(Node* head)
{
    Node* temp=head;
    int count=0;
    while(temp!=NULL)
    {
        count++;
        temp=temp->next;
    }
    return count;
}
Node* middleLL(Node* head)
{
    int length= lengthLL(head);
    int k=(length/2)+1;
    int count=1;
    Node* temp=head;
    while(count!=k)
    {
        temp=temp->next;
        count++;
    }
    return temp;
}
Node* middleOptimal(Node* head)
{
    Node* slow=head;
    Node* fast= head;
    while(fast->next!=NULL && fast!=NULL)
    {
        slow=slow->next;
        fast=fast->next->next;
    }
    return slow;
}
int main()
{
    vector<int> arr={3,19,2,45,23};
    Node* head= convertarraytoLL(arr);
    // int length=lengthLL(head);
    // cout<<length;
    Node* middle=middleLL(head);
    cout<<middle->data;
}