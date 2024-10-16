import Array "mo:base/Array";
import Func "mo:base/Func";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Time "mo:base/Time";
import Principal "mo:base/Principal";

actor {

  // Define the Post type
  public type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Principal;
    timestamp: Int;
  };

  // Stable variable to store posts
  stable var posts: [Post] = [];

  // Function to add a new post
  public func addPost(title: Text, body: Text, author: Principal) : async Nat {
    let id = Nat.fromInt(posts.size());
    let timestamp = Time.now();
    let newPost : Post = {
      id = id;
      title = title;
      body = body;
      author = author;
      timestamp = timestamp;
    };
    posts := Array.append([newPost], posts);
    return id;
  };

  // Query function to get the list of posts
  public query func getPosts() : async [Post] {
    return posts;
  };
}
